@echo off
echo Uruchamianie aplikacji...
docker compose up -d
timeout /t 5
start http://localhost:3000