up:
	docker compose up -d

down:
	docker compose down --remove-orphans

build:
	docker compose build

up-db:
	docker compose up -d database

build-db:
	docker compose build database

down-db:
	docker compose down -v

logs:
	docker compose logs