.PHONY: build build-left build-right build-reset left right update clean clean-all flash-left flash-right flash-reset

build:
	docker compose -f docker/docker-compose.yml run --rm firmware /workspace/docker/build.sh

build-left:
	docker compose -f docker/docker-compose.yml run --rm firmware /workspace/docker/build.sh StackOverChonk_left

build-right:
	docker compose -f docker/docker-compose.yml run --rm firmware /workspace/docker/build.sh StackOverChonk_right

build-reset:
	docker compose -f docker/docker-compose.yml run --rm firmware /workspace/docker/build.sh settings_reset

left: build-left flash-left

right: build-right flash-right

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
