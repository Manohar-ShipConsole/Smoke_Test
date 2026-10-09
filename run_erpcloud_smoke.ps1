# PowerShell script to run ERP Cloud Playwright Automation (Navigation Only)

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

# Skipping FedEx, DHL, and UPS shipping tests for ERP Cloud
Write-Host "`n[SKIPPED] Skipping ERP Cloud FedEx, DHL, and UPS shipping tests as per configuration." -ForegroundColor Yellow
$cloudFedExExitCode = -1
$cloudDhlExitCode   = -1
$cloudUpsExitCode   = -1

# Return to root directory
Set-Location -Path "$rootDir"

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host "Finished running all ERP Cloud Smoke Tests." -ForegroundColor Green
Write-Host "ERP Cloud Navigation Test: $(if ($cloudNavExitCode -eq 0) { 'PASSED' } else { 'FAILED' })" -ForegroundColor $(if ($cloudNavExitCode -eq 0) { 'Green' } else { 'Red' })
Write-Host "ERP Cloud FedEx Shipping:  SKIPPED" -ForegroundColor Yellow
Write-Host "ERP Cloud DHL Shipping:    SKIPPED" -ForegroundColor Yellow
Write-Host "ERP Cloud UPS Shipping:    SKIPPED" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Green

# Expose exit status for master summary table
$global:Cloud_Nav   = $cloudNavExitCode
$global:Cloud_FedEx = $cloudFedExExitCode
$global:Cloud_DHL   = $cloudDhlExitCode
$global:Cloud_UPS   = $cloudUpsExitCode
