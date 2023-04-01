import { db, func, v2 } from "./firebase";
import { deleteDataset } from "./vertexai/dataset";
import { deleteModel, exportModel, listModelEvaluation } from "./vertexai/model";
import { listTrainingPipelines } from "./vertexai/pipeline";
import { Model } from "./_types";

export const updatemodels = v2.scheduler.onSchedule({ schedule: "0 * * * *" }, async () => {
  const pipelines = await listTrainingPipelines();

  await Promise.all(
    pipelines.map(async (p) => {
      const snap = await db.collection("models").where("datasetId", "==", p.datasetId).get();
      if (snap.docs.length === 0) return;

      const { modelId, state } = snap.docs[0].data() as Model;
      if (modelId === p.modelId && state === p.state) return;

      await snap.docs[0].ref.update({
        modelId: p.modelId,
        state: p.state,
      });

      if (p.state === "PIPELINE_STATE_SUCCEEDED") {
        const evalu = await listModelEvaluation({ modelId: p.modelId! });
        const urlTflite = await exportModel({ format: "tflite", modelId: p.modelId! });
        const urlSavedModel = await exportModel({ format: "tf-saved-model", modelId: p.modelId! });
        await snap.docs[0].ref.update({
          auPrc: evalu.auPrc,
          evalId: evalu.id,
          urlTflite,
          urlSavedModel,
        });
      }
    })
  );
});

export const cleanUpModel = func.firestore.document("/models/{modelId}").onDelete(async (snap) => {
  const model = (await snap.data()) as Model;
  await deleteDataset({ datasetId: model.datasetId });
  model.modelId && (await deleteModel({ modelId: model.modelId }));
});
