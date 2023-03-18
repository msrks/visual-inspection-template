import cv2
import glob
import os
import random
import shutil

from mlops.config import TTV, BaseInDir, BaseOutDir, Labels, LightingConditions
from mlops.augmentation import Transform
from mlops.make_importfile import make_importfile
from mlops.utils import get_filename, getFormatedJSTtime

# TODO: rawdataは sdkでとってくる。


def mainTask() -> None:
    timestamp: str = getFormatedJSTtime()
    base_outdir: str = f"./{BaseOutDir}/{timestamp}"

    # makedirs of "dataset"
    for light in LightingConditions:
        for ttv in TTV:
            for label in Labels:
                os.makedirs(f"{base_outdir}/{light}/{ttv}/{label}/", exist_ok=True)

    # copyfile & augment to "dataset"
    for light in LightingConditions:
        for label in Labels:
            path_list: dict[str, list[str]] = {}
            _all = glob.glob(f"./{BaseInDir}/{light}/{label}/*.jpg", recursive=True)
            path_list["training"] = random.sample(_all, int(len(_all) * 0.6))
            _no_train = list(set(_all) - set(path_list["training"]))
            path_list["test"] = random.sample(_no_train, int(len(_no_train) * 0.5))
            path_list["validation"] = list(set(_no_train) - set(path_list["test"]))
            for ttv in TTV:
                for img in path_list[ttv]:
                    shutil.copyfile(
                        img,
                        f"{base_outdir}/{light}/{ttv}/{label}/{get_filename(img)}.jpg",
                    )
                # augment
                if ttv == "training":
                    for img in path_list[ttv]:
                        for j in range(5):
                            cv2.imwrite(
                                f"{base_outdir}/{light}/training/{label}/{get_filename(img)}-{j}.jpg",
                                Transform(image=cv2.imread(img))["image"],
                            )

    make_importfile(timestamp)


if __name__ == "__main__":
    mainTask()
