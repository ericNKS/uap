up:
	docker-compose -f docker-compose.dev.yml -f docker-compose.yml up -d

down:
	docker-compose -f docker-compose.dev.yml -f docker-compose.yml down

build:
	docker-compose build

up-db:
	docker-compose -f docker-compose.dev.yml up -d

build-db:
	docker-compose -f docker-compose.dev.yml build

down-db:
	docker-compose -f docker-compose.dev.yml down