from google.cloud import storage
from backend.config import BucketName

client = storage.Client()
bucket = client.bucket(BucketName)
