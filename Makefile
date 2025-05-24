up:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

build:
	docker-compose build

up-db:
	docker-compose -f docker-compose.dev.yml up -d

build-db:
	docker-compose -f docker-compose.dev.yml build

down-db:
	docker-compose -f docker-compose.dev.yml down