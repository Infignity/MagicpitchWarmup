full_restart:
	docker compose down --rmi all
	docker compose up -d

format:
	black ./backend