from pydantic import BaseModel
from typing import List


class Label(BaseModel):
    imageId: str
    lightingCondition: str
    label: str


class Labels(BaseModel):
    labels: List[Label]
