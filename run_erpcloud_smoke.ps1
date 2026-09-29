# PowerShell script to run ERP Cloud Playwright Automation (Navigation, FedEx/DHL Shipping, UPS Shipping)

# Prevent Playwright from automatically serving HTML report on test failure (which blocks script waiting for Ctrl+C)
$env:PW_TEST_HTML_REPORT_OPEN = "never"

$rootDir = $PSScriptRoot
Set-Location -Path "$rootDir\ERPCloud_automation_script"

$smokeReportDir = "$rootDir\ERPCloud_automation_script\SmokeTest_Reports"
if (-not (Test-Path $smokeReportDir)) {
    New-Item -ItemType Directory -Path $smokeReportDir -Force | Out-Null
}

# --- Step 1: ERP Cloud Navigation Test ---
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Step 1: Running ERP Cloud Navigation Test..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$ts1 = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$navReportName = "ERPCloud_Navigation_Report_$ts1"
$env:PLAYWRIGHT_HTML_REPORT = "SmokeTest_Reports\$navReportName"

npx playwright test tests/PageNavigation.test.js
$cloudNavExitCode = $LASTEXITCODE

$reportSource = "$rootDir\ERPCloud_automation_script\playwright-report"
$navReportDest = "$smokeReportDir\$navReportName"
if (Test-Path $reportSource) {
    Copy-Item -Path $reportSource -Destination $navReportDest -Recurse -Force
    Write-Host "Saved ERP Cloud Navigation report to: $navReportDest" -ForegroundColor Yellow
}

# Only proceed to Shipping tests if Step 1 Navigation Test PASSED
if ($cloudNavExitCode -eq 0) {
    # --- Step 2: ERP Cloud Shipping Test (FedEx & DHL) ---
    Write-Host "`n==================================================" -ForegroundColor Cyan
    Write-Host "Step 2: Running ERP Cloud Shipping Test (FedEx | DHL)..." -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan

    $ts2 = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $fedexReportName = "ERPCloud_Shipping_FedEx_DHL_Report_$ts2"
    $env:PLAYWRIGHT_HTML_REPORT = "SmokeTest_Reports\$fedexReportName"

    npx playwright test tests/Shipping.test.js --grep="FedEx|DHL" --fully-parallel
    $cloudFedExExitCode = $LASTEXITCODE

    $fedexReportDest = "$smokeReportDir\$fedexReportName"
    if (Test-Path $reportSource) {
        Copy-Item -Path $reportSource -Destination $fedexReportDest -Recurse -Force
        Write-Host "Saved ERP Cloud FedEx/DHL report to: $fedexReportDest" -ForegroundColor Yellow
    }

    # --- Step 3: ERP Cloud Shipping Test (UPS) ---
    Write-Host "`n==================================================" -ForegroundColor Cyan
    Write-Host "Step 3: Running ERP Cloud Shipping Test (UPS)..." -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan

    $ts3 = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $upsReportName = "ERPCloud_Shipping_UPS_Report_$ts3"
    $env:PLAYWRIGHT_HTML_REPORT = "SmokeTest_Reports\$upsReportName"

    npx playwright test tests/Shipping.test.js --grep="UPS" --workers=1
    $cloudUpsExitCode = $LASTEXITCODE

    $upsReportDest = "$smokeReportDir\$upsReportName"
    if (Test-Path $reportSource) {
        Copy-Item -Path $reportSource -Destination $upsReportDest -Recurse -Force
        Write-Host "Saved ERP Cloud UPS report to: $upsReportDest" -ForegroundColor Yellow
    }
}
else {
    Write-Host "`n[SKIPPED] ERP Cloud Navigation test failed. Skipping FedEx, DHL, and UPS shipping tests." -ForegroundColor Yellow
    $cloudFedExExitCode = -1
    $cloudUpsExitCode = -1
}

# Return to root directory
Set-Location -Path "$rootDir"

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host "Finished running all ERP Cloud Smoke Tests." -ForegroundColor Green
Write-Host "ERP Cloud Navigation Test: $(if ($cloudNavExitCode -eq 0) { 'PASSED' } else { 'FAILED' })" -ForegroundColor $(if ($cloudNavExitCode -eq 0) { 'Green' } else { 'Red' })
Write-Host "ERP Cloud FedEx/DHL:        $(if ($cloudFedExExitCode -eq 0) { 'PASSED' } elseif ($cloudFedExExitCode -eq -1) { 'SKIPPED' } else { 'FAILED' })" -ForegroundColor $(if ($cloudFedExExitCode -eq 0) { 'Green' } elseif ($cloudFedExExitCode -eq -1) { 'Yellow' } else { 'Red' })
Write-Host "ERP Cloud UPS Shipping:     $(if ($cloudUpsExitCode -eq 0) { 'PASSED' } elseif ($cloudUpsExitCode -eq -1) { 'SKIPPED' } else { 'FAILED' })" -ForegroundColor $(if ($cloudUpsExitCode -eq 0) { 'Green' } elseif ($cloudUpsExitCode -eq -1) { 'Yellow' } else { 'Red' })
Write-Host "==================================================" -ForegroundColor Green

# Expose exit status for master summary table
$global:Cloud_Nav = $cloudNavExitCode
$global:Cloud_FedEx = $cloudFedExExitCode
$global:Cloud_UPS = $cloudUpsExitCode

