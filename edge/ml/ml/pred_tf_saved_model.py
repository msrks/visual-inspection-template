import numpy as np
import tensorflow as tf
import cv2

THRESHOLD = 0.5


def predict(image: np.ndarray, lighting: str) -> tuple[dict[str, float], str]:
    _, bts = cv2.imencode(".png", image)
    model = tf.saved_model.load(f"models/{lighting}")
    infer = model.signatures["serving_default"]  # type: ignore
    out = infer(key=tf.constant("dummy_id"), image_bytes=tf.constant([bts.tobytes()]))

    scores = out["scores"].numpy()[0]
    labels = [label.decode() for label in out["labels"].numpy()[0]]
    confidences: dict[str, float] = {
        labels[0]: float(scores[0]),
        labels[1]: float(scores[1]),
    }
    result: str = labels[1] if confidences[labels[1]] > THRESHOLD else labels[0]

    return (confidences, result)


if __name__ == "__main__":
    dummyImage = np.random.random_sample((500, 500, 3))
    c, r = predict(dummyImage, "original")
    print(c, r)
