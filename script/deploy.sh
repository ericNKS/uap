#!/bin/bash

UAP_PROJECT_ROOT="/home/google/uap"
COMPOSE_FILE="${UAP_PROJECT_ROOT}/docker-compose.yml"
DOCKERFILE_CONTEXT="${UAP_PROJECT_ROOT}"
APP_CONTAINER_NAME="app"
APP_IMAGE_NAME="app"

echo "--- Starting Deployment Script ---"

echo "--- 1. Pulling latest changes for UAP project from origin main ---"
if git -C "${UAP_PROJECT_ROOT}" pull origin main; then
  echo "Git pull successful."
else
  echo "Git pull failed!"
  exit 1
fi

echo "--- 2. Starting/Updating services with Docker Compose ---"
# Moved -d to be after 'up' and added --remove-orphans.
# This is a common syntax and might help if parsing of '-d' at the end is problematic.
if docker-compose -f "${COMPOSE_FILE}" up -d --remove-orphans redis rabbitmq api-send-mail service-send-mail; then
  echo "Docker Compose services (redis, rabbitmq, api-send-mail, service-send-mail) started/updated successfully."
else
  echo "Docker Compose up command failed!"
  echo "Attempting to get logs for Docker Compose services..."
  docker-compose -f "${COMPOSE_FILE}" logs --tail="50" redis rabbitmq api-send-mail service-send-mail || echo "Failed to retrieve compose logs."
  exit 1
fi

echo "--- 3. Building the main application image '${APP_IMAGE_NAME}' ---"
# Use the correct context path where your Dockerfile is located.
if docker build -t "${APP_IMAGE_NAME}" "${DOCKERFILE_CONTEXT}"; then
  echo "Docker image '${APP_IMAGE_NAME}' built successfully."
else
  echo "Docker build failed!"
  exit 1
fi

echo "--- 4. Stopping and removing existing '${APP_CONTAINER_NAME}' container (if any) ---"
# Check if the container exists and stop/remove it
if docker ps -a --format '{{.Names}}' | grep -Eq "^${APP_CONTAINER_NAME}$"; then
  echo "Found existing container '${APP_CONTAINER_NAME}'. Stopping it..."
  docker stop "${APP_CONTAINER_NAME}"
  echo "Removing container '${APP_CONTAINER_NAME}'..."
  docker rm "${APP_CONTAINER_NAME}"
else
  echo "No existing container named '${APP_CONTAINER_NAME}' found to stop/remove."
fi

echo "--- 5. Running the new '${APP_CONTAINER_NAME}' container ---"
# Ensure you map the correct host port (e.g., 80) to the container port (e.g., 3000)
if docker run --name "${APP_CONTAINER_NAME}" -d -p 80:3000 "${APP_IMAGE_NAME}"; then
  echo "New container '${APP_CONTAINER_NAME}' started successfully."
else
  echo "Failed to run new '${APP_CONTAINER_NAME}' container!"
  echo "Attempting to get logs for the '${APP_CONTAINER_NAME}' container..."
  docker logs --tail="50" "${APP_CONTAINER_NAME}" || echo "Failed to retrieve logs for '${APP_CONTAINER_NAME}'."
  exit 1
fi

echo "--- Deployment script finished successfully ---"