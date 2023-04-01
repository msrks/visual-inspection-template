/* eslint-disable @typescript-eslint/no-explicit-any */
import { protos, v1 as ai } from "@google-cloud/aiplatform";
import { PARENT } from "../env";
const { definition } = protos.google.cloud.aiplatform.v1.schema.trainingjob;

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

export const trainAutoMLImageClassification = async ({ datasetId }: { datasetId: string }) => {
  await client.createTrainingPipeline({
    parent: PARENT,
    trainingPipeline: {
      displayName: Date.now().toString(),

      trainingTaskDefinition: "gs://google-cloud-aiplatform/schema/trainingjob/definition/automl_image_classification_1.0.0.yaml",
      trainingTaskInputs: (
        new definition.AutoMlImageClassificationInputs({
          multiLabel: false,
          modelType: definition.AutoMlImageClassificationInputs.ModelType.MOBILE_TF_VERSATILE_1,
          budgetMilliNodeHours: 8000,
          disableEarlyStopping: false,
        }) as any
      ).toValue(),
      inputDataConfig: {
        datasetId,
        fractionSplit: {
          trainingFraction: 0.8,
          validationFraction: 0.1,
          testFraction: 0.1,
        },
      },
    },
  });
};
