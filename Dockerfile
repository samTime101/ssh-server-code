# Multi-stage Dockerfile: builds React frontend and Django backend into one image

########################
# Stage 1: Build frontend
########################
# Multi-stage Dockerfile to build React (Vite) and serve with nginx

# build stage
FROM node:20-alpine AS builder
WORKDIR /app/react_frontend

# copy package manifests and install
COPY react_frontend/package.json react_frontend/package-lock.json* ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

COPY react_frontend .
RUN npm run build

# production nginx stage
FROM nginx:stable-alpine

# remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# copy built frontend
COPY --from=builder /app/react_frontend/dist /usr/share/nginx/html

# copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

########################
# Stage 2: Final image (Python)
########################
# Dockerfile for Django backend (web)
FROM python:3.14-slim-trixie

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Create and use a virtual environment to isolate Python dependencies
ENV VIRTUAL_ENV=/opt/venv
RUN python -m venv $VIRTUAL_ENV
# Ensure pip, wheel are available and use the venv's pip
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
ENV PIP_NO_CACHE_DIR=1

# System deps for mysqlclient and build tools
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
      build-essential \
      python3-dev \
      default-libmysqlclient-dev \
      pkg-config \
      netcat-traditional \
      ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt /app/requirements.txt
# Upgrade pip inside the venv and install requirements there
RUN python -m pip install --upgrade pip setuptools wheel && \
  pip install -r /app/requirements.txt

# Copy django backend
COPY django_backend /app/django_backend
WORKDIR /app/django_backend

# Ensure a server.log file exists and is writable by the container
# Use permissive permissions because the directory may be mounted from the host
RUN touch /app/django_backend/server.log && \
    chmod 666 /app/django_backend/server.log || true

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose port for gunicorn
EXPOSE 8000

# Default command - run entrypoint which handles migrations and superuser creation
ENTRYPOINT ["/app/entrypoint.sh"]
