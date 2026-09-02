@echo off
title KFS OS - DEVELOPMENT SERVER
cd /d "%~dp0"
echo Iniciando el servidor de KFS OS...
start http://localhost:3000
npm run dev
