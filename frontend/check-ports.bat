@echo off
echo 🔍 Checking port usage...
echo.

echo Port 3000:
netstat -ano | findstr :3000
echo.

echo Port 4000:
netstat -ano | findstr :4000
echo.

echo Port 5173:
netstat -ano | findstr :5173
echo.

echo Port 8080:
netstat -ano | findstr :8080
echo.

echo 💡 Alternative solutions:
echo 1. Try running: npm run dev
echo 2. If still fails, manually specify port: npx vite --port 8080
echo 3. Or try port 9000: npx vite --port 9000
echo 4. Run as administrator if needed
echo.

pause