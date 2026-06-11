# Push para o repositório oficial da igreja (conta assembleiadedeussacra)
# Execute no PowerShell:  .\scripts\push-assembleiadedeussacra.ps1
# No Git Bash use:        bash scripts/push-assembleiadedeussacra.sh

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

$Gcm = "git-credential-manager"
if (Test-Path "C:\Program Files\Git\mingw64\bin\git-credential-manager.exe") {
    $Gcm = "C:\Program Files\Git\mingw64\bin\git-credential-manager.exe"
}

$Repo = "assembleiadedeussacra/site-igrejav2"
$RemoteUrl = "https://github.com/$Repo.git"

Write-Host "Configurando remote upstream (repo oficial)..." -ForegroundColor Cyan
git remote get-url upstream 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    git remote add upstream $RemoteUrl
} else {
    git remote set-url upstream $RemoteUrl
}

Write-Host "Remotes:" -ForegroundColor Cyan
git remote -v

Write-Host "Buscando upstream..." -ForegroundColor Yellow
git fetch upstream

$ahead = git rev-list --count upstream/main..HEAD 2>$null
if ($LASTEXITCODE -ne 0) { $ahead = 0 }

Write-Host "`nCommits locais a enviar para assembleiadedeussacra: $ahead" -ForegroundColor Cyan
if ($ahead -gt 0) {
    git log upstream/main..HEAD --oneline
} else {
    Write-Host "(nenhum — local ja esta igual ao repo oficial)" -ForegroundColor Yellow
}

Write-Host "`nRemovendo login GitHub da conta Jailton-Silva..." -ForegroundColor Yellow
& $Gcm github logout Jailton-Silva 2>$null
"protocol=https`nhost=github.com" | & $Gcm erase 2>$null
"protocol=https`nhost=github.com`nusername=Jailton-Silva" | & $Gcm erase 2>$null

if ($env:GITHUB_TOKEN) {
    Write-Host "`nUsando GITHUB_TOKEN para push como assembleiadedeussacra..." -ForegroundColor Green
    git -c credential.helper= push "https://assembleiadedeussacra:$($env:GITHUB_TOKEN)@github.com/$Repo.git" HEAD:main
    if ($LASTEXITCODE -eq 0) {
        git push fork main 2>$null
        Write-Host "Fork Jailton-Silva tambem atualizado." -ForegroundColor Green
    }
} else {
    Write-Host @"

========================================
  ERRO 403: Git usa conta Jailton-Silva
========================================

Use token da conta assembleiadedeussacra:

  1. github.com > assembleiadedeussacra > Settings > Developer settings > Tokens
  2. Generate (classic) > marque 'repo'
  3. No PowerShell:

     `$env:GITHUB_TOKEN='ghp_SEU_TOKEN'
     .\scripts\push-assembleiadedeussacra.ps1

Alternativa sem token — abrir Pull Request do fork:
  https://github.com/assembleiadedeussacra/site-igrejav2/compare/main...Jailton-Silva:site-igrejav2:main

"@ -ForegroundColor Yellow
    exit 1
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nPush concluido com sucesso!" -ForegroundColor Green
    Write-Host "Repo: https://github.com/$Repo" -ForegroundColor Cyan
} else {
    Write-Host "`nPush falhou. Verifique o token da conta assembleiadedeussacra." -ForegroundColor Red
    exit 1
}
