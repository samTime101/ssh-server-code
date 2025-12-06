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
