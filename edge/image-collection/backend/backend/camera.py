import cv2


class Camera:
    def __init__(self):
        self.video = cv2.VideoCapture(0)

    def __del__(self):
        self.video.release()

    def get_frame(self):
        success, image = self.video.read()
        ret, jpeg = cv2.imencode(".jpg", image)
        return jpeg.tobytes()

    def save_frame(self, fname: str):
        success, image = self.video.read()
        cv2.imwrite(f"./static/{fname}", image)
