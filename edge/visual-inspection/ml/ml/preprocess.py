import cv2


def preprocess(img, input_shape):
    return cv2.resize(img, dsize=input_shape)
