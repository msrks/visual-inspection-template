import { v1 as ai } from "@google-cloud/aiplatform";
import { PARENT } from "../env";

const client = new ai.PipelineServiceClient({
  apiEndpoint: "us-central1-aiplatform.googleapis.com",
});

export const listTrainingPipelines = async () => {
  const [trainingPipelines, ,] = await client.listTrainingPipelines({
    parent: PARENT,
  });
  // console.log(JSON.stringify(trainingPipelines, null, 2));
  const result = trainingPipelines.map((tp) => ({
    id: tp.name?.split("/").slice(-1)[0],
    // name: tp.name,
    // displayName: tp.displayName,
    // seconds: tp.createTime?.seconds,
    datetime: new Date(1000 * +(tp.createTime?.seconds?.toString() || 0)),
    datasetId: tp.inputDataConfig?.datasetId,
    modelId: tp.modelToUpload?.name?.split("/").slice(-1)[0],
    state: tp.state,
  }));
  console.log(JSON.stringify(result, null, 2));
  return result;
};
