# PowerShell script to run NS Playwright Automation (Navigation, FedEx/DHL Shipping, UPS Shipping)

# Prevent Playwright from automatically serving HTML report on test failure (which blocks script waiting for Ctrl+C)
$env:PW_TEST_HTML_REPORT_OPEN = "never"

$rootDir = $PSScriptRoot
Set-Location -Path "$rootDir\ns_playwright_automation"

$smokeReportDir = "$rootDir\ns_playwright_automation\SmokeTest_Reports"
if (-not (Test-Path $smokeReportDir)) {
    New-Item -ItemType Directory -Path $smokeReportDir -Force | Out-Null
}

# --- Step 1: NS Navigation Test ---
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Step 1: Running NS Navigation Test..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$ts1 = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$navReportName = "NS_Navigation_Report_$ts1"
$env:PLAYWRIGHT_HTML_REPORT = "SmokeTest_Reports\$navReportName"

npx playwright test tests/NavigationPage.test.js
$nsNavExitCode = $LASTEXITCODE

$reportSource = "$rootDir\ns_playwright_automation\playwright-report"
$navReportDest = "$smokeReportDir\$navReportName"
if (Test-Path $reportSource) {
    Copy-Item -Path $reportSource -Destination $navReportDest -Recurse -Force
    Write-Host "Saved NS Navigation report to: $navReportDest" -ForegroundColor Yellow
}

# Only proceed to Shipping tests if Step 1 Navigation Test PASSED
if ($nsNavExitCode -eq 0) {
    # --- Step 2: NS Shipping Test (FedEx & DHL) ---
    Write-Host "`n==================================================" -ForegroundColor Cyan
    Write-Host "Step 2: Running NS Shipping Test (FedEx | DHL)..." -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan

    $ts2 = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $fedexReportName = "NS_Shipping_FedEx_DHL_Report_$ts2"
    $env:PLAYWRIGHT_HTML_REPORT = "SmokeTest_Reports\$fedexReportName"

    npx playwright test tests/Shipping.test.js --grep="FedEx|DHL" --fully-parallel
    $nsFedExExitCode = $LASTEXITCODE

    $fedexReportDest = "$smokeReportDir\$fedexReportName"
    if (Test-Path $reportSource) {
        Copy-Item -Path $reportSource -Destination $fedexReportDest -Recurse -Force
        Write-Host "Saved NS FedEx/DHL report to: $fedexReportDest" -ForegroundColor Yellow
    }

    # --- Step 3: NS Shipping Test (UPS) ---
    Write-Host "`n==================================================" -ForegroundColor Cyan
    Write-Host "Step 3: Running NS Shipping Test (UPS)..." -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan

    $ts3 = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $upsReportName = "NS_Shipping_UPS_Report_$ts3"
    $env:PLAYWRIGHT_HTML_REPORT = "SmokeTest_Reports\$upsReportName"

    npx playwright test tests/Shipping.test.js --grep="UPS" --workers=1
    $nsUpsExitCode = $LASTEXITCODE

    $upsReportDest = "$smokeReportDir\$upsReportName"
    if (Test-Path $reportSource) {
        Copy-Item -Path $reportSource -Destination $upsReportDest -Recurse -Force
        Write-Host "Saved NS UPS report to: $upsReportDest" -ForegroundColor Yellow
    }
}
else {
    Write-Host "`n[SKIPPED] NS Navigation test failed. Skipping FedEx, DHL, and UPS shipping tests." -ForegroundColor Yellow
    $nsFedExExitCode = -1
    $nsUpsExitCode = -1
}

# Return to root directory
Set-Location -Path "$rootDir"

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host "Finished running all NS Smoke Tests." -ForegroundColor Green
Write-Host "NS Navigation Test:      $(if ($nsNavExitCode -eq 0) { 'PASSED' } else { 'FAILED' })" -ForegroundColor $(if ($nsNavExitCode -eq 0) { 'Green' } else { 'Red' })
Write-Host "NS FedEx/DHL Shipping:   $(if ($nsFedExExitCode -eq 0) { 'PASSED' } elseif ($nsFedExExitCode -eq -1) { 'SKIPPED' } else { 'FAILED' })" -ForegroundColor $(if ($nsFedExExitCode -eq 0) { 'Green' } elseif ($nsFedExExitCode -eq -1) { 'Yellow' } else { 'Red' })
Write-Host "NS UPS Shipping:         $(if ($nsUpsExitCode -eq 0) { 'PASSED' } elseif ($nsUpsExitCode -eq -1) { 'SKIPPED' } else { 'FAILED' })" -ForegroundColor $(if ($nsUpsExitCode -eq 0) { 'Green' } elseif ($nsUpsExitCode -eq -1) { 'Yellow' } else { 'Red' })
Write-Host "==================================================" -ForegroundColor Green

# Expose exit status for master summary table
$global:NS_Nav = $nsNavExitCode
$global:NS_FedEx = $nsFedExExitCode
$global:NS_UPS = $nsUpsExitCode


