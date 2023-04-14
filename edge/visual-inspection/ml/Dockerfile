FROM python:3.10-slim AS builder

EXPOSE 8000

ENV POETRY_HOME="/opt/poetry" \
  POETRY_VIRTUALENVS_CREATE=false \
  PIP_NO_CACHE_DIR=off \
  PIP_DISABLE_PIP_VERSION_CHECK=on \
  PIP_DEFAULT_TIMEOUT=100 \
  PYSETUP_PATH="/opt/pysetup"

ENV PATH="$POETRY_HOME/bin:$PATH"

RUN apt-get update && \
  apt-get install --no-install-recommends -y curl && \
  apt-get clean
RUN apt install -y libopencv-dev
RUN curl -sSL https://install.python-poetry.org/ | python -

# packages install
RUN mkdir /app
WORKDIR /app
COPY ./pyproject.toml /app/pyproject.toml
RUN poetry install --only main

# Python script
COPY . /app

# EXPOSE 80
# CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "80"]
CMD ["uvicorn", "ml.app:app", "--host", "0.0.0.0", "--port", "8080"]
