# ==============================================================================
# PrepVault - Automated Startup Launcher for Windows
# Checks for Node.js / Express backend; launches or serves web portal seamlessly
# ==============================================================================

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   🚀 Starting PrepVault - Placement & Interview Portal     " -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

$port = 5000
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue

if ($nodeCmd) {
    Write-Host "[Node.js Detected]: Running Express & MongoDB API Server..." -ForegroundColor Green
    if (-not (Test-Path "node_modules")) {
        Write-Host "[Dependencies]: Installing node_modules..." -ForegroundColor Yellow
        npm install
    }
    Write-Host "[Server]: Starting Node server on http://localhost:$port" -ForegroundColor Green
    Start-Process "http://localhost:$port"
    node server.js
} else {
    Write-Host "[Notice]: Node.js is not in system PATH." -ForegroundColor Yellow
    Write-Host "[Launcher]: Starting Windows Built-in HTTP Server on http://localhost:$port..." -ForegroundColor Green
    
    $prefix = "http://localhost:$port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    
    try {
        $listener.Start()
    } catch {
        Write-Host "[Info]: Fallback opening index.html directly in browser..." -ForegroundColor Yellow
        $indexPath = Join-Path (Get-Location) "public\index.html"
        Start-Process $indexPath
        exit
    }

    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "  ✨ PrepVault Web Portal is active at: $prefix" -ForegroundColor Cyan
    Write-Host "  Press Ctrl+C to terminate web server." -ForegroundColor Gray
    Write-Host "============================================================" -ForegroundColor Green
    
    Start-Process $prefix

    $publicFolder = Join-Path (Get-Location) "public"

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($urlPath) -or $urlPath -eq "/") {
            $urlPath = "index.html"
        }

        $localFilePath = Join-Path $publicFolder $urlPath

        if (Test-Path $localFilePath -PathType Leaf) {
            $contentBytes = [System.IO.File]::ReadAllBytes($localFilePath)
            $ext = [System.IO.Path]::GetExtension($localFilePath).ToLower()

            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                default { "application/octet-stream" }
            }

            $response.ContentType = $contentType
            $response.ContentLength64 = $contentBytes.Length
            $response.OutputStream.Write($contentBytes, 0, $contentBytes.Length)
        } else {
            # Fallback to index.html for Single Page Application
            $indexFile = Join-Path $publicFolder "index.html"
            $contentBytes = [System.IO.File]::ReadAllBytes($indexFile)
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $contentBytes.Length
            $response.OutputStream.Write($contentBytes, 0, $contentBytes.Length)
        }
        $response.Close()
    }
}
