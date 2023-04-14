import base64
import cv2
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from ml import model, pred_tf_saved_model, pred_tflite

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://visual-inspection-template.web.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predModule = {"tflite": pred_tflite, "tf_saved_model": pred_tf_saved_model}


@app.post("/predict", response_model=model.PredResult)
async def predict(data: model.Data, modelType: model.ModelType) -> dict:
    im_array = np.frombuffer(base64.b64decode(data.image.encode()), dtype=np.uint8)
    im = cv2.imdecode(im_array, cv2.IMREAD_UNCHANGED)
    confidences, result = predModule[modelType].predict(im, "original")
    return {"confidences": confidences, "result": result}
