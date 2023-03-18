import google.cloud.storage as storage
from config import BUCKET_NAME

client = storage.Client()
bucket = client.bucket(BUCKET_NAME)

bucket.blob("").download_to_filename("")
