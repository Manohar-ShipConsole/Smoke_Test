# PowerShell script to run EBS Playwright Automation (Navigation, FedEx/DHL Shipping, UPS Shipping)

# Prevent Playwright from automatically serving HTML report on test failure (which blocks script waiting for Ctrl+C)
$env:PW_TEST_HTML_REPORT_OPEN = "never"

$rootDir = $PSScriptRoot
Set-Location -Path "$rootDir\ebs_playwright_automation"

$smokeReportDir = "$rootDir\ebs_playwright_automation\SmokeTest_Reports"
if (-not (Test-Path $smokeReportDir)) {
    New-Item -ItemType Directory -Path $smokeReportDir -Force | Out-Null
}

# --- Step 1: EBS Navigation Test ---
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Step 1: Running EBS Navigation Test..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$ts1 = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$navReportName = "EBS_Navigation_Report_$ts1"
$env:PLAYWRIGHT_HTML_REPORT = "SmokeTest_Reports\$navReportName"

npx playwright test tests/PageNavigation.test.js
$ebsNavExitCode = $LASTEXITCODE

$reportSource = "$rootDir\ebs_playwright_automation\playwright-report"
$navReportDest = "$smokeReportDir\$navReportName"
if (Test-Path $reportSource) {
    Copy-Item -Path $reportSource -Destination $navReportDest -Recurse -Force
    Write-Host "Saved EBS Navigation report to: $navReportDest" -ForegroundColor Yellow
}

# Helper function to check if Shipping Page navigation succeeded in pulse report
function Check-ShippingPagePassed ($reportJsonPath, $exitCode) {
    if ($exitCode -eq 0) { return $true }
    if (Test-Path $reportJsonPath) {
        try {
            $json = Get-Content $reportJsonPath -Raw | ConvertFrom-Json
            if ($json.results) {
                foreach ($res in $json.results) {
                    if ($res.steps) {
                        $shippingStep = $res.steps | Where-Object { $_.title -like "*Shipping should navigate to the correct URL*" -or $_.title -like "*Shipping should load with the correct page title*" }
                        if ($shippingStep -and ($shippingStep | Where-Object { $_.status -eq "passed" })) {
                            return $true
                        }
                    }
                }
            }
        }
        catch {}
    }
    return $false
}

$pulseFile = "$rootDir\ebs_playwright_automation\pulse-report\playwright-pulse-report.json"
$shippingNavPassed = Check-ShippingPagePassed $pulseFile $ebsNavExitCode

# Proceed to Shipping tests if Shipping Page Navigation PASSED (even if another menu item failed)
if ($shippingNavPassed) {
    Write-Host "`n[CHECK] Shipping page navigated successfully. Proceeding to carrier shipping tests..." -ForegroundColor Green

    # --- Step 2: EBS Shipping Test (FedEx & DHL) ---
    Write-Host "`n==================================================" -ForegroundColor Cyan
    Write-Host "Step 2: Running EBS Shipping Test (FedEx | DHL)..." -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan

    $ts2 = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $fedexReportName = "EBS_Shipping_FedEx_DHL_Report_$ts2"
    $env:PLAYWRIGHT_HTML_REPORT = "SmokeTest_Reports\$fedexReportName"

    npx playwright test tests/Shipping.test.js --grep="FedEx|DHL" --fully-parallel
    $ebsStep2ExitCode = $LASTEXITCODE

    # Helper function to get carrier specific status from pulse report
    function Get-CarrierStatus ($reportJsonPath, $carrierName, $stepExit) {
        if ($stepExit -eq -1) { return -1 }
        if (Test-Path $reportJsonPath) {
            try {
                $json = Get-Content $reportJsonPath -Raw | ConvertFrom-Json
                if ($json.results) {
                    $carrierResults = $json.results | Where-Object { $_.name -like "*$carrierName*" -or $_.title -like "*$carrierName*" }
                    if ($carrierResults) {
                        $failedCount = ($carrierResults | Where-Object { $_.status -ne "passed" }).Count
                        if ($failedCount -gt 0) { return 1 }
                        return 0
                    }
                }
            } catch {}
        }
        return $stepExit
    }

    $ebsFedExExitCode = Get-CarrierStatus $pulseFile "FedEx" $ebsStep2ExitCode
    $ebsDhlExitCode   = Get-CarrierStatus $pulseFile "DHL"   $ebsStep2ExitCode

    $fedexReportDest = "$smokeReportDir\$fedexReportName"
    if (Test-Path $reportSource) {
        Copy-Item -Path $reportSource -Destination $fedexReportDest -Recurse -Force
        Write-Host "Saved EBS FedEx/DHL report to: $fedexReportDest" -ForegroundColor Yellow
    }

    # --- Step 3: EBS Shipping Test (UPS) ---
    Write-Host "`n==================================================" -ForegroundColor Cyan
    Write-Host "Step 3: Running EBS Shipping Test (UPS)..." -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan

    $ts3 = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $upsReportName = "EBS_Shipping_UPS_Report_$ts3"
    $env:PLAYWRIGHT_HTML_REPORT = "SmokeTest_Reports\$upsReportName"

    npx playwright test tests/Shipping.test.js --grep="UPS" --workers=1
    $ebsUpsExitCode = $LASTEXITCODE

    $upsReportDest = "$smokeReportDir\$upsReportName"
    if (Test-Path $reportSource) {
        Copy-Item -Path $reportSource -Destination $upsReportDest -Recurse -Force
        Write-Host "Saved EBS UPS report to: $upsReportDest" -ForegroundColor Yellow
    }
}
else {
    Write-Host "`n[SKIPPED] EBS Shipping page navigation failed. Skipping FedEx, DHL, and UPS shipping tests." -ForegroundColor Yellow
    $ebsFedExExitCode = -1
    $ebsDhlExitCode   = -1
    $ebsUpsExitCode   = -1
}

# Return to root directory
Set-Location -Path "$rootDir"

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host "Finished running all EBS Smoke Tests." -ForegroundColor Green
Write-Host "EBS Navigation Test:     $(if ($ebsNavExitCode -eq 0) { 'PASSED' } else { 'FAILED' })" -ForegroundColor $(if ($ebsNavExitCode -eq 0) { 'Green' } else { 'Red' })
Write-Host "EBS FedEx Shipping:      $(if ($ebsFedExExitCode -eq 0) { 'PASSED' } elseif ($ebsFedExExitCode -eq -1) { 'SKIPPED' } else { 'FAILED' })" -ForegroundColor $(if ($ebsFedExExitCode -eq 0) { 'Green' } elseif ($ebsFedExExitCode -eq -1) { 'Yellow' } else { 'Red' })
Write-Host "EBS DHL Shipping:        $(if ($ebsDhlExitCode -eq 0) { 'PASSED' } elseif ($ebsDhlExitCode -eq -1) { 'SKIPPED' } else { 'FAILED' })" -ForegroundColor $(if ($ebsDhlExitCode -eq 0) { 'Green' } elseif ($ebsDhlExitCode -eq -1) { 'Yellow' } else { 'Red' })
Write-Host "EBS UPS Shipping:        $(if ($ebsUpsExitCode -eq 0) { 'PASSED' } elseif ($ebsUpsExitCode -eq -1) { 'SKIPPED' } else { 'FAILED' })" -ForegroundColor $(if ($ebsUpsExitCode -eq 0) { 'Green' } elseif ($ebsUpsExitCode -eq -1) { 'Yellow' } else { 'Red' })
Write-Host "==================================================" -ForegroundColor Green

# Expose exit status for master summary table
$global:EBS_Nav   = $ebsNavExitCode
$global:EBS_FedEx = $ebsFedExExitCode
$global:EBS_DHL   = $ebsDhlExitCode
$global:EBS_UPS   = $ebsUpsExitCode


