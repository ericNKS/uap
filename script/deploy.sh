#!/bin/bash

git pull origin main
sudo docker-compose -f ../docker-compose.yml up redis rabbitmq api-send-mail service-send-mail
sudo docker build -t app ../
sudo docker stop app
sudo docker run --name app -d -p 80:3000 app