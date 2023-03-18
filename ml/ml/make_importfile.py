import csv
import os
from ml.config import BUCKET_NAME, TTV, Labels, LightingConditions


def write_csv(fname: str, row_data: list[str]) -> None:
    with open(fname, "a", newline="\n") as f:
        wr = csv.writer(f, delimiter=",")
        wr.writerow(row_data)


def make_importfile(time: str) -> None:
    # https://cloud.google.com/vertex-ai/docs/image-data/classification/prepare-data
    for light in LightingConditions:
        for ttv in TTV:
            for label in Labels:
                images: list[str] = os.listdir(f"dataset/{time}/{light}/{ttv}/{label}")
                for img in images:
                    row_data: list[str] = [
                        ttv,
                        f"gs://{BUCKET_NAME}/dataset/{time}/{light}/{ttv}/{label}/{img}",
                        label,
                    ]
                    write_csv(f"./dataset/{time}/{light}/importFile.csv", row_data)
