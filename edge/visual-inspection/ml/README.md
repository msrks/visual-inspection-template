#

```sh
docker build -t test0407poetry -f Dockerfile .

docker container run -it -d -p 8080:8080 --name test0407poetry1 test0407poetry
```

```sh
gcloud run deploy edge-ml --region "asia-northeast1" --source . \
    --allow-unauthenticated --quiet
```

## predict using docker container

```sh
export CPU_DOCKER_GCR_PATH=gcr.io/cloud-devrel-public-resources/gcloud-container-1.14.0:latest
docker pull $CPU_DOCKER_GCR_PATH

export CONTAINER_NAME=test-tf-serve0323-3
export PORT=8001
export MODEL_PATH=/tmp/hoge

docker run --rm --name $CONTAINER_NAME -p $PORT:8501 -v $MODEL_PATH:/tmp/mounted_model/0001 -t $CPU_DOCKER_GCR_PATH

echo `docker run --rm --name $CONTAINER_NAME -p $PORT:8501 -v $MODEL_PATH:/tmp/mounted_model/0001 -t $CPU_DOCKER_GCR_PATH`
```
