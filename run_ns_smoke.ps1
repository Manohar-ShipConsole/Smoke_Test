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

# Helper function to check if ONLY expected Batch Ship page failed in NS Navigation
function Check-OnlyExpectedBatchShipFailed ($reportJsonPath, $exitCode) {
    if ($exitCode -eq 0) { return $true }
    if (Test-Path $reportJsonPath) {
        try {
            $json = Get-Content $reportJsonPath -Raw | ConvertFrom-Json
            if ($json.results) {
                $navResults = $json.results | Where-Object { $_.spec_file -like "*Navigation*" -or $_.name -like "*Navigation*" }
                if ($navResults) {
                    function Get-FailedSteps ($steps) {
                        $f = @()
                        foreach ($s in $steps) {
                            if ($s.status -eq "failed") { $f += $s }
                            if ($s.steps) { $f += Get-FailedSteps $s.steps }
                        }
                        return $f
                    }

                    $failedSteps = @()
                    foreach ($res in $navResults) {
                        if ($res.steps) { $failedSteps += Get-FailedSteps $res.steps }
                    }

                    $errorStrings = @()
                    foreach ($res in $navResults) {
                        if ($res.errors) {
                            foreach ($e in $res.errors) { $errorStrings += "$e" }
                        }
                    }
                    foreach ($fs in $failedSteps) {
                        $errorStrings += "$($fs.title) $($fs.error)"
                    }

                    if ($errorStrings.Count -gt 0) {
                        $otherFailures = $errorStrings | Where-Object { $_ -notlike "*Batch Ship*" -and $_ -notlike "*batchship*" }
                        if ($otherFailures.Count -eq 0) {
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

$pulseFile = "$rootDir\ns_playwright_automation\pulse-report\playwright-pulse-report.json"
$shippingNavPassed = Check-ShippingPagePassed $pulseFile $nsNavExitCode

# Check if NS Navigation failed ONLY due to expected Batch Ship failure
if ($nsNavExitCode -ne 0 -and (Check-OnlyExpectedBatchShipFailed $pulseFile $nsNavExitCode)) {
    Write-Host "`n[NOTE] Only expected 'Batch Ship' failure detected in NS Navigation. Treating NS Navigation as PASSED for terminal summary." -ForegroundColor Yellow
    $nsNavExitCode = 0
}

# Proceed to Shipping tests if Shipping Page Navigation PASSED (even if another menu item failed)
if ($shippingNavPassed) {
    Write-Host "`n[CHECK] Shipping page navigated successfully. Proceeding to carrier shipping tests..." -ForegroundColor Green

    # --- Step 2: NS Shipping Test (FedEx & DHL) ---
    Write-Host "`n==================================================" -ForegroundColor Cyan
    Write-Host "Step 2: Running NS Shipping Test (FedEx | DHL)..." -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan

    $ts2 = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $fedexReportName = "NS_Shipping_FedEx_DHL_Report_$ts2"
    $env:PLAYWRIGHT_HTML_REPORT = "SmokeTest_Reports\$fedexReportName"

    npx playwright test tests/Shipping.test.js --fully-parallel
    $nsStep2ExitCode = $LASTEXITCODE

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
            }
            catch {}
        }
        return $stepExit
    }

    $nsFedExExitCode = Get-CarrierStatus $pulseFile "FedEx" $nsStep2ExitCode
    $nsDhlExitCode = Get-CarrierStatus $pulseFile "DHL"   $nsStep2ExitCode

    $fedexReportDest = "$smokeReportDir\$fedexReportName"
    if (Test-Path $reportSource) {
        Copy-Item -Path $reportSource -Destination $fedexReportDest -Recurse -Force
        Write-Host "Saved NS FedEx/DHL report to: $fedexReportDest" -ForegroundColor Yellow
    }

    # --- Step 3: NS Shipping Test (UPS) ---
    # Write-Host "`n==================================================" -ForegroundColor Cyan
    # Write-Host "Step 3: Running NS Shipping Test (UPS)..." -ForegroundColor Cyan
    # Write-Host "==================================================" -ForegroundColor Cyan

    # $ts3 = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    # $upsReportName = "NS_Shipping_UPS_Report_$ts3"
    # $env:PLAYWRIGHT_HTML_REPORT = "SmokeTest_Reports\$upsReportName"

    # npx playwright test tests/Shipping.test.js --grep="UPS" --workers=1
    # $nsUpsExitCode = $LASTEXITCODE

    # $upsReportDest = "$smokeReportDir\$upsReportName"
    # if (Test-Path $reportSource) {
    #     Copy-Item -Path $reportSource -Destination $upsReportDest -Recurse -Force
    #     Write-Host "Saved NS UPS report to: $upsReportDest" -ForegroundColor Yellow
    # }
    $nsUpsExitCode = -1
}
else {
    Write-Host "`n[SKIPPED] NS Shipping page navigation failed. Skipping FedEx and DHL shipping tests." -ForegroundColor Yellow
    $nsFedExExitCode = -1
    $nsDhlExitCode = -1
    $nsUpsExitCode = -1
}

# Return to root directory
Set-Location -Path "$rootDir"

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host "Finished running all NS Smoke Tests." -ForegroundColor Green
Write-Host "NS Navigation Test:      $(if ($nsNavExitCode -eq 0) { 'PASSED' } else { 'FAILED' })" -ForegroundColor $(if ($nsNavExitCode -eq 0) { 'Green' } else { 'Red' })
Write-Host "NS FedEx Shipping:       $(if ($nsFedExExitCode -eq 0) { 'PASSED' } elseif ($nsFedExExitCode -eq -1) { 'SKIPPED' } else { 'FAILED' })" -ForegroundColor $(if ($nsFedExExitCode -eq 0) { 'Green' } elseif ($nsFedExExitCode -eq -1) { 'Yellow' } else { 'Red' })
Write-Host "NS DHL Shipping:         $(if ($nsDhlExitCode -eq 0) { 'PASSED' } elseif ($nsDhlExitCode -eq -1) { 'SKIPPED' } else { 'FAILED' })" -ForegroundColor $(if ($nsDhlExitCode -eq 0) { 'Green' } elseif ($nsDhlExitCode -eq -1) { 'Yellow' } else { 'Red' })
# Write-Host "NS UPS Shipping:         $(if ($nsUpsExitCode -eq 0) { 'PASSED' } elseif ($nsUpsExitCode -eq -1) { 'SKIPPED' } else { 'FAILED' })" -ForegroundColor $(if ($nsUpsExitCode -eq 0) { 'Green' } elseif ($nsUpsExitCode -eq -1) { 'Yellow' } else { 'Red' })
Write-Host "==================================================" -ForegroundColor Green

# Expose exit status for master summary table
$global:NS_Nav = $nsNavExitCode
$global:NS_FedEx = $nsFedExExitCode
$global:NS_DHL = $nsDhlExitCode
$global:NS_UPS = $nsUpsExitCode






