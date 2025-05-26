# syntax=docker/dockerfile:1-labs
FROM python:3.12-alpine
WORKDIR /usr/local/app

# Build backend & ml dependencies
RUN pip install poetry==2.0.1

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

COPY pyproject.toml poetry.lock .
RUN poetry install --no-root && rm -rf $POETRY_CACHE_DIR

COPY *.py .

# Generate secret key
RUN python > .env <<EOF
import os
print('SECRET_KEY="%x"' % int.from_bytes(os.urandom(32)))
EOF

EXPOSE 8000:8000
CMD ["poetry", "run", "fastapi", "run", "--proxy-headers"]
