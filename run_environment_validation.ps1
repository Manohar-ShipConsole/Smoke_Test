# PowerShell script to run Environment Validation (URLs UP check for all ERP environments)

$env:PW_TEST_HTML_REPORT_OPEN = "never"

$rootDir = $PSScriptRoot
Set-Location -Path "$rootDir\ebs_playwright_automation"

$smokeReportDir = "$rootDir\ebs_playwright_automation\SmokeTest_Reports"
if (-not (Test-Path $smokeReportDir)) {
    New-Item -ItemType Directory -Path $smokeReportDir -Force | Out-Null
}

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Running Environment Validation (URLs UP Check)..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$ts = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$envReportName = "Environment_Validation_Report_$ts"
$env:PLAYWRIGHT_HTML_REPORT = "SmokeTest_Reports\$envReportName"

npx playwright test tests/EnvironmentValidation.test.js --project=chromium
$envValidationExitCode = $LASTEXITCODE

$reportSource = "$rootDir\ebs_playwright_automation\playwright-report"
$envReportDest = "$smokeReportDir\$envReportName"
if (Test-Path $reportSource) {
    Copy-Item -Path $reportSource -Destination $envReportDest -Recurse -Force
    Write-Host "Saved Environment Validation report to: $envReportDest" -ForegroundColor Yellow
}

# Return to root directory
Set-Location -Path "$rootDir"

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host "Finished running Environment Validation Tests." -ForegroundColor Green
Write-Host "Environment Validation: $(if ($envValidationExitCode -eq 0) { 'PASSED' } else { 'FAILED' })" -ForegroundColor $(if ($envValidationExitCode -eq 0) { 'Green' } else { 'Red' })
Write-Host "==================================================" -ForegroundColor Green

$global:EnvValidation_ExitCode = $envValidationExitCode
