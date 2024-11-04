.PHONY: compose build down clean
compose:
	docker-compose up -d

build:
	docker-compose build

down:
	docker-compose down -v

clean:
	docker-compose down -v --rmi 'all'