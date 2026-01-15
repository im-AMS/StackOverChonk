.PHONY: build update clean flash-left flash-right flash-reset

build:
	docker compose -f docker/docker-compose.yml run --rm firmware /workspace/docker/build.sh

update:
	docker compose -f docker/docker-compose.yml run --rm firmware /workspace/docker/update.sh

clean:
	rm -rf build/
	rm -f docker/output/*.uf2
	@echo "Cleaned build artifacts"

clean-all: clean
	docker compose -f docker/docker-compose.yml down -v
	@echo "Removed Docker volumes (will re-download on next build)"

flash-left:
	./flash.sh left

flash-right:
	./flash.sh right

flash-reset:
	./flash.sh reset
