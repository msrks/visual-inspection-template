import uvicorn


def mainTask() -> None:
    print("stop: ctrl+c")
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    mainTask()
