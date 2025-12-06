# Multi-stage Dockerfile: builds React frontend and Django backend into one image

########################
# Stage 1: Build frontend
########################
FROM node:18-bullseye-slim AS node-builder
WORKDIR /app/react_frontend

# Copy package files first for caching
COPY react_frontend/package*.json ./

# Install deps and build
RUN apt-get update \
    && apt-get install -y ca-certificates curl --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY react_frontend/ ./
RUN npm ci --silent
RUN npm run build

########################
# Stage 2: Final image (Python)
########################
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# System deps required for some Python packages (mysqlclient, psycopg)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       default-libmysqlclient-dev \
       libpq-dev \
       netcat \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt ./
RUN python -m venv /opt/venv
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy Django project
COPY django_backend/ ./django_backend/

# Make sure static folder exists and copy frontend build into it
RUN mkdir -p django_backend/static/frontend
COPY --from=node-builder /app/react_frontend/dist ./django_backend/static/frontend

# Copy entrypoint and give execute permission
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /app/django_backend

# Environment defaults (can be overridden at runtime)
ENV DJANGO_SETTINGS_MODULE=main.settings.base
ENV PORT=8000

EXPOSE 8000

CMD ["/entrypoint.sh"]
