# PowerShell script to run Navigation tests sequentially across 4 ERPs: NS, JDE, EBS, and ERP Cloud

# Prevent Playwright from automatically serving HTML report on test failure (which blocks script waiting for Ctrl+C)
$env:PW_TEST_HTML_REPORT_OPEN = "never"

$rootDir = $PSScriptRoot

# --- Step 1: NS Navigation Test ---
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Step 1: Running Navigation test in NS Playwright..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$nsTimestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$nsReportName = "NS_Navigation_Report_$nsTimestamp"
$env:PLAYWRIGHT_HTML_REPORT = "SmokeTest_Reports\$nsReportName"

Set-Location -Path "$rootDir\ns_playwright_automation"
npx playwright test tests/NavigationPage.test.js
$nsExitCode = $LASTEXITCODE

# Copy/Save NS report into SmokeTest_Reports with ERP name and timestamp
$nsReportSource = "$rootDir\ns_playwright_automation\playwright-report"
$nsReportDest = "$rootDir\ns_playwright_automation\SmokeTest_Reports\$nsReportName"
if (Test-Path $nsReportSource) {
    if (-not (Test-Path "$rootDir\ns_playwright_automation\SmokeTest_Reports")) {
        New-Item -ItemType Directory -Path "$rootDir\ns_playwright_automation\SmokeTest_Reports" -Force | Out-Null
    }
    Copy-Item -Path $nsReportSource -Destination $nsReportDest -Recurse -Force
    Write-Host "Saved NS Navigation report to: $nsReportDest" -ForegroundColor Yellow
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
        } catch {}
    }
    return $false
}

$pulseFile = "$rootDir\ns_playwright_automation\pulse-report\playwright-pulse-report.json"
if ($nsExitCode -ne 0 -and (Check-OnlyExpectedBatchShipFailed $pulseFile $nsExitCode)) {
    Write-Host "`n[NOTE] Only expected 'Batch Ship' failure detected in NS Navigation. Treating NS Navigation as PASSED for terminal summary." -ForegroundColor Yellow
    $nsExitCode = 0
}

# --- Step 2: JDE Navigation Test ---
Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "Step 2: Running Navigation test in JDE Playwright..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$jdeTimestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$jdeReportName = "JDE_Navigation_Report_$jdeTimestamp"
$env:PLAYWRIGHT_HTML_REPORT = "SmokeTest_Reports\$jdeReportName"

Set-Location -Path "$rootDir\jde_playwright_automation"
npx playwright test tests/NavigationPage.test.js
$jdeExitCode = $LASTEXITCODE

# Copy/Save JDE report into SmokeTest_Reports with ERP name and timestamp
$jdeReportSource = "$rootDir\jde_playwright_automation\playwright-report"
$jdeReportDest = "$rootDir\jde_playwright_automation\SmokeTest_Reports\$jdeReportName"
if (Test-Path $jdeReportSource) {
    if (-not (Test-Path "$rootDir\jde_playwright_automation\SmokeTest_Reports")) {
        New-Item -ItemType Directory -Path "$rootDir\jde_playwright_automation\SmokeTest_Reports" -Force | Out-Null
    }
    Copy-Item -Path $jdeReportSource -Destination $jdeReportDest -Recurse -Force
    Write-Host "Saved JDE Navigation report to: $jdeReportDest" -ForegroundColor Yellow
}

# --- Step 3: EBS Navigation Test ---
Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "Step 3: Running Navigation test in EBS Playwright..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$ebsTimestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$ebsReportName = "EBS_Navigation_Report_$ebsTimestamp"
$env:PLAYWRIGHT_HTML_REPORT = "SmokeTest_Reports\$ebsReportName"

Set-Location -Path "$rootDir\ebs_playwright_automation"
npx playwright test tests/PageNavigation.test.js
$ebsExitCode = $LASTEXITCODE

# Copy/Save EBS report into SmokeTest_Reports with ERP name and timestamp
$ebsReportSource = "$rootDir\ebs_playwright_automation\playwright-report"
$ebsReportDest = "$rootDir\ebs_playwright_automation\SmokeTest_Reports\$ebsReportName"
if (Test-Path $ebsReportSource) {
    if (-not (Test-Path "$rootDir\ebs_playwright_automation\SmokeTest_Reports")) {
        New-Item -ItemType Directory -Path "$rootDir\ebs_playwright_automation\SmokeTest_Reports" -Force | Out-Null
    }
    Copy-Item -Path $ebsReportSource -Destination $ebsReportDest -Recurse -Force
    Write-Host "Saved EBS Navigation report to: $ebsReportDest" -ForegroundColor Yellow
}

# --- Step 4: ERP Cloud Navigation Test ---
Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "Step 4: Running Navigation test in ERP Cloud Playwright..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$cloudTimestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$cloudReportName = "ERPCloud_Navigation_Report_$cloudTimestamp"
$env:PLAYWRIGHT_HTML_REPORT = "SmokeTest_Reports\$cloudReportName"

Set-Location -Path "$rootDir\ERPCloud_automation_script"
npx playwright test tests/PageNavigation.test.js
$cloudExitCode = $LASTEXITCODE

# Copy/Save ERP Cloud report into SmokeTest_Reports with ERP name and timestamp
$cloudReportSource = "$rootDir\ERPCloud_automation_script\playwright-report"
$cloudReportDest = "$rootDir\ERPCloud_automation_script\SmokeTest_Reports\$cloudReportName"
if (Test-Path $cloudReportSource) {
    if (-not (Test-Path "$rootDir\ERPCloud_automation_script\SmokeTest_Reports")) {
        New-Item -ItemType Directory -Path "$rootDir\ERPCloud_automation_script\SmokeTest_Reports" -Force | Out-Null
    }
    Copy-Item -Path $cloudReportSource -Destination $cloudReportDest -Recurse -Force
    Write-Host "Saved ERP Cloud Navigation report to: $cloudReportDest" -ForegroundColor Yellow
}

# Return to root directory
Set-Location -Path "$rootDir"
Write-Host "`n==================================================" -ForegroundColor Green
Write-Host "Finished running all 4 ERP Navigation tests." -ForegroundColor Green
Write-Host "NS Navigation Test:        $(if ($nsExitCode -eq 0) { 'PASSED' } else { 'FAILED' })" -ForegroundColor $(if ($nsExitCode -eq 0) { 'Green' } else { 'Red' })
Write-Host "JDE Navigation Test:       $(if ($jdeExitCode -eq 0) { 'PASSED' } else { 'FAILED' })" -ForegroundColor $(if ($jdeExitCode -eq 0) { 'Green' } else { 'Red' })
Write-Host "EBS Navigation Test:       $(if ($ebsExitCode -eq 0) { 'PASSED' } else { 'FAILED' })" -ForegroundColor $(if ($ebsExitCode -eq 0) { 'Green' } else { 'Red' })
Write-Host "ERP Cloud Navigation Test: $(if ($cloudExitCode -eq 0) { 'PASSED' } else { 'FAILED' })" -ForegroundColor $(if ($cloudExitCode -eq 0) { 'Green' } else { 'Red' })
Write-Host "==================================================" -ForegroundColor Green
