import numpy as np
import tensorflow as tf
from ml.config import Labels
from ml.preprocess import preprocess


THRESHOLD = 0.5


def predict(image: np.ndarray, lighting: str) -> tuple[dict[str, float], str]:
    I = tf.lite.Interpreter(f"models/{lighting}/model.tflite")
    I.allocate_tensors()
    [_, h, w, _] = I.get_input_details()[0]["shape"]
    _in = np.array([preprocess(image, (w, h))], dtype=np.uint8)

    I.set_tensor(I.get_input_details()[0]["index"], _in)
    I.invoke()
    _out = I.get_tensor(I.get_output_details()[0]["index"])

    scores = np.squeeze(_out)
    labels = Labels[lighting]
    confidences: dict[str, float] = {
        labels[0]: scores[0] / 255,
        labels[1]: scores[1] / 255,
    }
    result: str = labels[1] if confidences[labels[1]] > THRESHOLD else labels[0]

    return (confidences, result)


if __name__ == "__main__":
    dummyImage = np.random.random_sample((500, 500, 3))
    c, r = predict(dummyImage, "original")
    print(c, r)
