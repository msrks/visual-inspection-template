import albumentations as albu


def get_augmentation():
    train_transform = [
        albu.Blur(blur_limit=(7, 11), p=1),
        albu.GaussNoise(
            var_limit=(100, 500), mean=0, per_channel=True, always_apply=False, p=0.5
        ),
        albu.Rotate(
            limit=[-15, 15],
            interpolation=1,
            border_mode=4,
            value=None,
            mask_value=None,
            always_apply=False,
            p=0.5,
        ),
        albu.ShiftScaleRotate(
            shift_limit=0.1,
            scale_limit=0,
            rotate_limit=0,
            interpolation=1,
            border_mode=4,
            value=None,
            mask_value=None,
            shift_limit_x=None,
            shift_limit_y=None,
            always_apply=False,
            p=0.5,
        ),
    ]
    return albu.OneOf(train_transform)


Transform = get_augmentation()
