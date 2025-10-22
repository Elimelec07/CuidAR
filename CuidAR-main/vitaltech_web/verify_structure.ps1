# Script de PowerShell para verificar rutas en el proyecto

Write-Host "=== VERIFICACIÓN DE RUTAS EN VITALTECH WEB ===" -ForegroundColor Green

# Verificar estructura del proyecto
Write-Host "`nEstructura del proyecto:" -ForegroundColor Yellow
Get-ChildItem -Directory | ForEach-Object { Write-Host "  📁 $($_.Name)" }
Write-Host "  📄 index.html" -ForegroundColor Cyan

Write-Host "`nArchivos HTML en carpeta HTML/:" -ForegroundColor Yellow
Get-ChildItem "HTML\*.html" | ForEach-Object { Write-Host "  📄 $($_.Name)" }

Write-Host "`nArchivos CSS:" -ForegroundColor Yellow  
Get-ChildItem "CSS\*.css" | ForEach-Object { Write-Host "  🎨 $($_.Name)" }

Write-Host "`nArchivos JS:" -ForegroundColor Yellow
Get-ChildItem "JS\*.js" | ForEach-Object { Write-Host "  📜 $($_.Name)" }

Write-Host "`n=== VERIFICACIÓN COMPLETADA ===" -ForegroundColor Green