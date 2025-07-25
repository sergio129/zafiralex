@echo off
echo ===== Preparando despliegue a Vercel =====

echo.
echo 2. Añadiendo cambios al repositorio...
git add .

echo.
echo 3. Realizando commit...
set /p commit_msg="Ingrese el mensaje del commit: "
git commit -m "%commit_msg%"

echo.
echo 4. Enviando cambios a GitHub...
git push origin master

echo.
echo ===== Proceso completado =====
echo Verifica el panel de Vercel para confirmar el despliegue automático
echo https://vercel.com/dashboard
pause
