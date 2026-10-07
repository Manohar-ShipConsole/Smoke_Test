# PowerShell master script to run all Smoke Tests (NS, JDE, EBS, and ERP Cloud) sequentially

$env:PW_TEST_HTML_REPORT_OPEN = "never"
$rootDir = $PSScriptRoot

# 0. Environment Validation - Check all URLs
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "         CHECKING ALL THE URLS UP (ENVIRONMENT VALIDATION)       " -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan

Write-Host "`n>>> Executing Environment Validation Suite..." -ForegroundColor Yellow
& "$rootDir\run_environment_validation.ps1"

Write-Host "`n==================================================================" -ForegroundColor Magenta
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

function Get-StatusColor ($code) {
    if ($code -eq 0) { return "Green" }
    elseif ($code -eq -1) { return "Yellow" }
    else { return "Red" }
}

$envTxt = Get-StatusText $global:EnvValidation_ExitCode
$envCol = Get-StatusColor $global:EnvValidation_ExitCode

Write-Host "`n==========================================================================================" -ForegroundColor Cyan
Write-Host "                        OVERALL MULTI-ERP SMOKE TEST RESULTS SUMMARY                       " -ForegroundColor Cyan
Write-Host "==========================================================================================" -ForegroundColor Cyan
Write-Host "Environment Validation (URLs UP): " -NoNewline -ForegroundColor White
Write-Host "$envTxt" -ForegroundColor $envCol
Write-Host "------------------------------------------------------------------------------------------" -ForegroundColor Gray
Write-Host ("{0,-18} | {1,-16} | {2,-18} | {3,-18} | {4,-12}" -f "ERP System", "Navigation Test", "FedEx Shipping", "DHL Shipping", "UPS Shipping") -ForegroundColor White
Write-Host "------------------------------------------------------------------------------------------" -ForegroundColor Gray

$erps = @(
    @{ Name = "NetSuite (NS)";    Nav = $global:NS_Nav;    FedEx = $global:NS_FedEx;    DHL = $global:NS_DHL;    UPS = $global:NS_UPS },
    @{ Name = "JD Edwards (JDE)";  Nav = $global:JDE_Nav;   FedEx = $global:JDE_FedEx;   DHL = $global:JDE_DHL;   UPS = $global:JDE_UPS },
    @{ Name = "EBS";               Nav = $global:EBS_Nav;   FedEx = $global:EBS_FedEx;   DHL = $global:EBS_DHL;   UPS = $global:EBS_UPS },
    @{ Name = "ERP Cloud";         Nav = $global:Cloud_Nav; FedEx = $global:Cloud_FedEx; DHL = $global:Cloud_DHL; UPS = $global:Cloud_UPS }
)

foreach ($erp in $erps) {
    # 1. Print ERP Name (White)
    Write-Host ("{0,-18} | " -f $erp.Name) -NoNewline -ForegroundColor White

    # 2. Print Navigation Test Status
    $navTxt = Get-StatusText $erp.Nav
    $navCol = Get-StatusColor $erp.Nav
    Write-Host ("{0,-16}" -f $navTxt) -NoNewline -ForegroundColor $navCol
    Write-Host " | " -NoNewline -ForegroundColor White

    # 3. Print FedEx Shipping Status
    $fedexTxt = Get-StatusText $erp.FedEx
    $fedexCol = Get-StatusColor $erp.FedEx
    Write-Host ("{0,-18}" -f $fedexTxt) -NoNewline -ForegroundColor $fedexCol
    Write-Host " | " -NoNewline -ForegroundColor White

    # 4. Print DHL Shipping Status
    $dhlTxt = Get-StatusText $erp.DHL
    $dhlCol = Get-StatusColor $erp.DHL
    Write-Host ("{0,-18}" -f $dhlTxt) -NoNewline -ForegroundColor $dhlCol
    Write-Host " | " -NoNewline -ForegroundColor White

    # 5. Print UPS Shipping Status
    $upsTxt = Get-StatusText $erp.UPS
    $upsCol = Get-StatusColor $erp.UPS
    Write-Host ("{0,-12}" -f $upsTxt) -ForegroundColor $upsCol
}

Write-Host "==========================================================================================" -ForegroundColor Cyan
Write-Host "Environment Validation (URLs UP): $envTxt" -ForegroundColor $envCol
Write-Host "`nALL 4 ERP SMOKE TEST SUITES COMPLETED!" -ForegroundColor Magenta


