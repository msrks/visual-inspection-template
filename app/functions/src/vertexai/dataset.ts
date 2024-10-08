/* eslint-disable @typescript-eslint/no-explicit-any */
import { v1 as ai } from "@google-cloud/aiplatform";
import { PARENT, PROJECT_ID, REGION } from "../env";

const client = new ai.DatasetServiceClient({
  apiEndpoint: "us-central1-aiplatform.googleapis.com",
});

export const createDatasetImage = async ({ displayName }: { displayName: string }): Promise<string> => {
  const [res] = await client.createDataset({
    parent: PARENT,
    dataset: {
      displayName,
      metadataSchemaUri: "gs://google-cloud-aiplatform/schema/dataset/metadata/image_1.0.0.yaml",
    },
  });
  // Wait for operation to complete
  await res.promise();
  const result = res.result as any;
  const datasetId = result.name.split("/").slice(-1)[0];
  return datasetId;
};

export const importDataImage = async ({ datasetId, gcsSourceUri }: { datasetId: string; gcsSourceUri: string }) => {
  const [response] = await client.importData({
    name: client.datasetPath(PROJECT_ID, REGION, datasetId),
    importConfigs: [
      {
        gcsSource: { uris: [gcsSourceUri] },
        importSchemaUri: "gs://google-cloud-aiplatform/schema/dataset/ioformat/image_classification_single_label_io_format_1.0.0.yaml",
      },
    ],
  });
  console.log(`Long running operation: ${response.name}`);

  // Wait for operation to complete
  // await response.promise();
};

export const deleteDataset = async ({ datasetId }: { datasetId: string }) => {
  await client.deleteDataset({
    name: client.datasetPath(PROJECT_ID, REGION, datasetId),
  });
  // await res.promise();
};
