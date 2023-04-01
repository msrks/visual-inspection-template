import { db, func, v2 } from "./firebase";
import { deleteDataset } from "./vertexai/dataset";
import { deleteModel, exportModel, listModelEvaluation } from "./vertexai/model";
import { listTrainingPipelines, trainAutoMLImageClassification } from "./vertexai/pipeline";
import { Model } from "./_types";

const trainModels = async () => {
  // https://cloud.google.com/vertex-ai/docs/reference/rest/v1/PipelineState
  await Promise.all(
    (
      await db.collection("models").get()
    ).docs
      .map((d) => d.data() as Model)
      .filter((m) => !m.modelId && !["PIPELINE_STATE_QUEUED", "PIPELINE_STATE_PENDING", "PIPELINE_STATE_RUNNING"].includes(m.state || ""))
      .map(async (m) => await trainAutoMLImageClassification({ datasetId: m.datasetId }))
  );
};

export const updatemodels = v2.scheduler.onSchedule({ schedule: "0 * * * *" }, async () => {
  await trainModels();
  await Promise.all(
    (
      await listTrainingPipelines()
    ).map(async (p) => {
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
