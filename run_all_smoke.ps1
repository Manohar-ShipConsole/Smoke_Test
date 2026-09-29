# PowerShell master script to run all Smoke Tests (NS, JDE, EBS, and ERP Cloud) sequentially

$rootDir = $PSScriptRoot

Write-Host "==================================================================" -ForegroundColor Magenta
Write-Host "   STARTING ALL ERP SMOKE TESTS (NS, JDE, EBS & ERP CLOUD)      " -ForegroundColor Magenta
Write-Host "==================================================================" -ForegroundColor Magenta

# 1. Run NS Smoke Suite
Write-Host "`n>>> Executing NS Smoke Suite..." -ForegroundColor Yellow
& "$rootDir\run_ns_smoke.ps1"

# 2. Run JDE Smoke Suite
Write-Host "`n>>> Executing JDE Smoke Suite..." -ForegroundColor Yellow
& "$rootDir\run_jde_smoke.ps1"

# 3. Run EBS Smoke Suite
Write-Host "`n>>> Executing EBS Smoke Suite..." -ForegroundColor Yellow
& "$rootDir\run_ebs_smoke.ps1"

# 4. Run ERP Cloud Smoke Suite
Write-Host "`n>>> Executing ERP Cloud Smoke Suite..." -ForegroundColor Yellow
& "$rootDir\run_erpcloud_smoke.ps1"

Set-Location -Path "$rootDir"

# --- Master Summary Table ---
function Get-StatusText ($code) {
    if ($code -eq 0) { return "PASSED" }
    elseif ($code -eq -1) { return "SKIPPED" }
    else { return "FAILED" }
}

Write-Host "`n=================================================================================" -ForegroundColor Cyan
Write-Host "                 OVERALL MULTI-ERP SMOKE TEST RESULTS SUMMARY                   " -ForegroundColor Cyan
Write-Host "=================================================================================" -ForegroundColor Cyan
Write-Host ("{0,-18} | {1,-16} | {2,-22} | {3,-12}" -f "ERP System", "Navigation Test", "FedEx / DHL Shipping", "UPS Shipping") -ForegroundColor White
Write-Host "---------------------------------------------------------------------------------" -ForegroundColor Gray

$erps = @(
    @{ Name = "NetSuite (NS)"; Nav = $global:NS_Nav; FedEx = $global:NS_FedEx; UPS = $global:NS_UPS },
    @{ Name = "JD Edwards (JDE)"; Nav = $global:JDE_Nav; FedEx = $global:JDE_FedEx; UPS = $global:JDE_UPS },
    @{ Name = "EBS"; Nav = $global:EBS_Nav; FedEx = $global:EBS_FedEx; UPS = $global:EBS_UPS },
    @{ Name = "ERP Cloud"; Nav = $global:Cloud_Nav; FedEx = $global:Cloud_FedEx; UPS = $global:Cloud_UPS }
)

foreach ($erp in $erps) {
    $navTxt = Get-StatusText $erp.Nav
    $fedexTxt = Get-StatusText $erp.FedEx
    $upsTxt = Get-StatusText $erp.UPS

    $line = "{0,-18} | {1,-16} | {2,-22} | {3,-12}" -f $erp.Name, $navTxt, $fedexTxt, $upsTxt

    if ($erp.Nav -ne 0 -or $erp.FedEx -gt 0 -or $erp.UPS -gt 0) {
        Write-Host $line -ForegroundColor Red
    }
    elseif ($erp.FedEx -eq -1 -or $erp.UPS -eq -1) {
        Write-Host $line -ForegroundColor Yellow
    }
    else {
        Write-Host $line -ForegroundColor Green
    }
}

Write-Host "=================================================================================" -ForegroundColor Cyan
Write-Host "`nALL 4 ERP SMOKE TEST SUITES COMPLETED SUCCESSFULLY!" -ForegroundColor Magenta
