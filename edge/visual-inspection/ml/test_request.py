import requests
import json
import base64


# MODEL_TYPE = "tf_saved_model"
MODEL_TYPE = "tflite"


URL = f"https://visual-inspection-template.web.app/predict?modelType={MODEL_TYPE}"
# URL = f"https://edge-ml-tqpferbhdq-an.a.run.app/predict?modelType={MODEL_TYPE}"
# URL = f"http://localhost:8001/predict?modelType={MODEL_TYPE}"
PATH = "./sample.png"

# https://cloud.google.com/vertex-ai/docs/general/base64?hl=ja#python
with open(PATH, "rb") as f:
    b64img = base64.b64encode(f.read())
data = {"image": b64img.decode()}
res = requests.post(URL, json=data)
print(res.json())
