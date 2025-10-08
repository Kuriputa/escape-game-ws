# Script PowerShell pour démarrer un serveur web local
# Pour tester le jeu Phaser

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Escape Game - Serveur Local" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Python est installé
$pythonInstalled = Get-Command python -ErrorAction SilentlyContinue

if ($pythonInstalled) {
    Write-Host "✓ Python détecté" -ForegroundColor Green
    Write-Host "Démarrage du serveur sur http://localhost:8000" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Gray
    Write-Host ""
    
    # Ouvrir le navigateur après 2 secondes
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:8000/index.html"
    
    # Démarrer le serveur Python
    python -m http.server 8000
} else {
    Write-Host "✗ Python n'est pas installé" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternatives:" -ForegroundColor Yellow
    Write-Host "1. Installer Python: https://www.python.org/downloads/" -ForegroundColor Gray
    Write-Host "2. Utiliser Node.js: npx http-server -p 8000" -ForegroundColor Gray
    Write-Host "3. Utiliser l'extension VS Code 'Live Server'" -ForegroundColor Gray
    Write-Host ""
    pause
}