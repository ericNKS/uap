#!/bin/bash

git pull origin main
docker-compose -f ../docker-compose.yml up redis rabbitmq api-send-mail service-send-mail
docker build -t app ../
docker stop app
docker run --name app -d -p 80:3000 app