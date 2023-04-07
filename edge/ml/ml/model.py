from enum import Enum
from pydantic import BaseModel


class Data(BaseModel):
    image: str


class ModelType(str, Enum):
    tflite = "tflite"
    tf_saved_model = "tf_saved_model"


class LabelType(str, Enum):
    dog = "dog"
    cat = "cat"


class Confidence(BaseModel):
    dog: float
    cat: float


class PredResult(BaseModel):
    confidences: Confidence
    result: LabelType
