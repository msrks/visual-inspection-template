from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import time
from backend.camera import Camera
import uuid
from backend.firebase import db
from backend.model import Labels
import backend.gcs as gcs
from backend.config import BucketName
from firebase_admin import firestore

app: FastAPI = FastAPI()

origins: list[str] = [
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/static", StaticFiles(directory="static"), name="static")

camera: Camera = Camera()


@app.get("/image_capture")
async def imageCapture():
    global camera
    # TODO: 照明1を制御
    time.sleep(1)
    im1 = str(uuid.uuid4()) + ".jpg"
    camera.save_frame(im1)
    # TODO: 照明2を制御
    time.sleep(1)
    im2 = str(uuid.uuid4()) + ".jpg"
    camera.save_frame(im2)
    return {
        "images": [
            {
                "imageId": im1,
                "imagePath": f"/static/{im1}",
                "lightingCondition": "domeLight",
            },
            {
                "imageId": im2,
                "imagePath": f"/static/{im2}",
                "lightingCondition": "barLight",
            },
        ]
    }


def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n")


@app.get("/video_feed")
async def video_feed() -> StreamingResponse:
    return StreamingResponse(
        gen(camera), media_type="multipart/x-mixed-replace; boundary=frame"
    )


@app.post("/register_label")
async def register_label(labels: Labels) -> None:
    print(labels.dict())
    for l in labels.labels:
        if l.label != "invalid":
            basePath: str = f"rawdata/humanLabeling/{l.lightingCondition}/{l.label}"
            dstFile: str = f"{basePath}/{l.imageId}"
            gcs.bucket.blob(dstFile).upload_from_filename(f"./static/{l.imageId}")
            db.collection("images").add(
                {
                    "imageId": l.imageId,
                    "imagePath": f"gs://{BucketName}/{dstFile}",
                    "lightingCondition": l.lightingCondition,
                    "humanLabel": l.label,
                    "createdAt": firestore.SERVER_TIMESTAMP,
                    "updatedAt": firestore.SERVER_TIMESTAMP,
                }
            )


app.mount("/", StaticFiles(directory="./static", html=True), name="html")
