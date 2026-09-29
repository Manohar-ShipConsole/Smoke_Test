# 🚀 ERP Test Automation - Execution Guide

## 💻 1. Running in VS Code / PowerShell

* Make sure to be in the struts_playwright_automation folder *

```powershell
# 1. Run Navigation Tests (All 4 ERPs)
.\run_navigations.ps1

# 2. Run Individual ERP Smoke Tests
.\run_ns_smoke.ps1        # NetSuite
.\run_jde_smoke.ps1       # JDE
.\run_ebs_smoke.ps1       # EBS
.\run_erpcloud_smoke.ps1  # ERP Cloud

# 3. Run Complete Master Suite (All 4 ERPs)
.\run_all_smoke.ps1
```

---

## 🖥️ 2. Running in Command Prompt (`cmd.exe`)

```cmd
:: 1. Run Navigation Tests (All 4 ERPs)
powershell -ExecutionPolicy Bypass -File .\run_navigations.ps1

:: 2. Run Individual ERP Smoke Tests
powershell -ExecutionPolicy Bypass -File .\run_ns_smoke.ps1
powershell -ExecutionPolicy Bypass -File .\run_jde_smoke.ps1
powershell -ExecutionPolicy Bypass -File .\run_ebs_smoke.ps1
powershell -ExecutionPolicy Bypass -File .\run_erpcloud_smoke.ps1

:: 3. Run Complete Master Suite (All 4 ERPs)
powershell -ExecutionPolicy Bypass -File .\run_all_smoke.ps1
```
