# docs

## GCS Storage Path

```sh
# 画像収集モード時の画像保存先
gs://visual-inspection-template/rawdata/humanLabeling/<lightingCondition>/<label>/*.png

# 推論モード時の画像保存先
gs://visual-inspection-template/rawdata/aiLabeling/<lightingCondition>/<label>/*.png

# AutoML学習用データセットImportFile
gs://visual-inspection-template/job/<lightingCondition>/<unixtime>.csv

# AutoMLモデルファイル
gs://visual-inspection-template/model/**/*.tflite
gs://visual-inspection-template/model/**/*.pb
```

## DB Schema

```yml
images: Collection
  id: {imageId}
    imageId: string!
    bucket: string!
    dstPath: string!
    lightingCondition: string!
    predLabel: string?
    predConfidence: number?
    humanLabel: string?
    createdAt: Timestamp!
    updatedAt: Timestamp!

metrics: Collection
  id: "yyyy-MM-dd"
    num: number!
    date: string!
    numUnreviewed: number!
    createdAt: Timestamp!
    updatedAt: Timestamp!

models: Collection
  id: {modelId}
    datasetId: string!
    gcsSourceUri: string!
    createdAt: Timestamp!
    updatedAt: Timestamp!
    lightingCondition: string!
    dateRange: [Timestamp, Timestamp]!
    numImages: number!
    numDogs: number!
    numCats: number!
    modelId: string?
    evalId: string?
    auPrc: number?
    state: string?
    urlTflite: string?
    urlSavedModel: string?
```
