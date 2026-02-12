# Dwellot Project Audit Script - Export to Excel
# Save this as: audit-dwellot.ps1
# Run from your dwellot project folder

Write-Host "=================================================="
Write-Host "DWELLOT PROJECT STRUCTURE AUDIT" -ForegroundColor Cyan
Write-Host "=================================================="
Write-Host ""

# Check if we're in a Node.js project
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: Not in a Node.js project directory" -ForegroundColor Red
    Write-Host "Please run this script from your dwellot project root"
    exit 1
}

# Create results object
$auditResults = @()

# Function to add result
function Add-AuditResult {
    param($Category, $Item, $Status, $Path)
    $script:auditResults += [PSCustomObject]@{
        Category = $Category
        Item = $Item
        Status = $Status
        Path = $Path
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    }
}

Write-Host "Scanning project structure..." -ForegroundColor Yellow
Write-Host ""

# 1. Configuration Files
Write-Host "Checking configuration files..." -ForegroundColor Green
$configFiles = @(
    "package.json",
    "tsconfig.json",
    "next.config.js",
    "next.config.mjs",
    "tailwind.config.ts",
    "tailwind.config.js",
    ".env.local",
    ".gitignore"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Add-AuditResult "Configuration" $file "Found" (Resolve-Path $file)
        Write-Host "  Found: $file" -ForegroundColor Green
    } else {
        Add-AuditResult "Configuration" $file "Missing" "N/A"
        Write-Host "  Missing: $file" -ForegroundColor Red
    }
}
Write-Host ""

# 2. Find App Directory
Write-Host "Scanning app directory..." -ForegroundColor Green
$appDir = $null
if (Test-Path "src/app") {
    $appDir = "src/app"
} elseif (Test-Path "app") {
    $appDir = "app"
}

if ($appDir) {
    Write-Host "  App directory found: $appDir" -ForegroundColor Cyan
    Add-AuditResult "Structure" "App Directory" "Found" $appDir
    
    # Find all pages
    $pages = Get-ChildItem -Path $appDir -Recurse -Filter "page.*" | Where-Object { $_.Extension -in ".tsx", ".ts", ".jsx", ".js" }
    
    Write-Host "  Found $($pages.Count) pages:" -ForegroundColor Yellow
    foreach ($page in $pages) {
        $relativePath = $page.DirectoryName.Replace((Get-Location).Path, "").Replace("\", "/")
        $route = $relativePath.Replace("/$appDir", "").Replace($appDir, "")
        if ($route -eq "") { $route = "/" }
        
        Add-AuditResult "Pages" $route "Exists" $page.FullName
        Write-Host "    Route: $route -> $($page.Name)" -ForegroundColor Green
    }
    
    # Find layouts
    $layouts = Get-ChildItem -Path $appDir -Recurse -Filter "layout.*" | Where-Object { $_.Extension -in ".tsx", ".ts", ".jsx", ".js" }
    Write-Host "  Found $($layouts.Count) layouts" -ForegroundColor Yellow
    foreach ($layout in $layouts) {
        Add-AuditResult "Layouts" $layout.Name "Exists" $layout.FullName
    }
} else {
    Write-Host "  No app directory found" -ForegroundColor Red
    Add-AuditResult "Structure" "App Directory" "Missing" "N/A"
}
Write-Host ""

# 3. Library Files
Write-Host "Scanning library files..." -ForegroundColor Green
$libDir = $null
if (Test-Path "src/lib") {
    $libDir = "src/lib"
} elseif (Test-Path "lib") {
    $libDir = "lib"
}

if ($libDir) {
    $libFiles = Get-ChildItem -Path $libDir -File
    Write-Host "  Lib directory: $libDir ($($libFiles.Count) files)" -ForegroundColor Cyan
    foreach ($file in $libFiles) {
        Add-AuditResult "Library" $file.Name "Found" $file.FullName
        Write-Host "    File: $($file.Name)" -ForegroundColor Green
    }
} else {
    Write-Host "  No lib directory found" -ForegroundColor Red
    Add-AuditResult "Library" "lib directory" "Missing" "N/A"
}
Write-Host ""

# 4. Components
Write-Host "Scanning components..." -ForegroundColor Green
$compDir = $null
if (Test-Path "src/components") {
    $compDir = "src/components"
} elseif (Test-Path "components") {
    $compDir = "components"
}

if ($compDir) {
    $components = Get-ChildItem -Path $compDir -Recurse -File | Where-Object { $_.Extension -in ".tsx", ".jsx" }
    Write-Host "  Components directory: $compDir ($($components.Count) components)" -ForegroundColor Cyan
    foreach ($comp in $components) {
        Add-AuditResult "Components" $comp.Name "Found" $comp.FullName
        Write-Host "    Component: $($comp.Name)" -ForegroundColor Green
    }
} else {
    Write-Host "  No components directory found" -ForegroundColor Yellow
    Add-AuditResult "Components" "components directory" "Missing" "N/A"
}
Write-Host ""

# 5. Check Dependencies
Write-Host "Checking key dependencies..." -ForegroundColor Green
$packageJson = Get-Content "package.json" | ConvertFrom-Json

$keyDependencies = @(
    "@supabase/supabase-js",
    "next",
    "react",
    "tailwindcss",
    "lucide-react"
)

foreach ($dep in $keyDependencies) {
    $found = $packageJson.dependencies.PSObject.Properties.Name -contains $dep
    if ($found) {
        $version = $packageJson.dependencies.$dep
        Add-AuditResult "Dependencies" $dep "Installed" $version
        Write-Host "  Installed: $dep ($version)" -ForegroundColor Green
    } else {
        Add-AuditResult "Dependencies" $dep "Not Installed" "N/A"
        Write-Host "  Missing: $dep" -ForegroundColor Red
    }
}
Write-Host ""

# 6. Supabase Configuration
Write-Host "Checking Supabase setup..." -ForegroundColor Green
$supabaseClient = (Test-Path "src/lib/supabase.ts") -or (Test-Path "lib/supabase.ts") -or (Test-Path "src/lib/supabase.js") -or (Test-Path "lib/supabase.js")
if ($supabaseClient) {
    Add-AuditResult "Supabase" "Client Configuration" "Configured" "lib/supabase.*"
    Write-Host "  Supabase client configured" -ForegroundColor Green
} else {
    Add-AuditResult "Supabase" "Client Configuration" "Not Found" "N/A"
    Write-Host "  Supabase client not found" -ForegroundColor Red
}

if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "NEXT_PUBLIC_SUPABASE_URL") {
        Add-AuditResult "Supabase" "Environment Variables" "Configured" ".env.local"
        Write-Host "  Supabase environment variables found" -ForegroundColor Green
    } else {
        Add-AuditResult "Supabase" "Environment Variables" "Incomplete" ".env.local"
        Write-Host "  Supabase environment variables incomplete" -ForegroundColor Yellow
    }
}
Write-Host ""

# Export to CSV (Excel can open this)
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$csvPath = "dwellot_audit_$timestamp.csv"
$auditResults | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8

Write-Host "=================================================="
Write-Host "AUDIT COMPLETE" -ForegroundColor Green
Write-Host "=================================================="
Write-Host ""
Write-Host "Results exported to: $csvPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  Total Items Scanned: $($auditResults.Count)"
Write-Host "  Found: $(($auditResults | Where-Object {$_.Status -eq 'Found' -or $_.Status -eq 'Exists' -or $_.Status -eq 'Installed' -or $_.Status -eq 'Configured'}).Count)" -ForegroundColor Green
Write-Host "  Missing: $(($auditResults | Where-Object {$_.Status -eq 'Missing' -or $_.Status -eq 'Not Installed' -or $_.Status -eq 'Not Found'}).Count)" -ForegroundColor Red
Write-Host ""
Write-Host "You can now open the CSV file in Excel!" -ForegroundColor Cyan
Write-Host ""

# Try to open in Excel automatically
try {
    Start-Process $csvPath
    Write-Host "Opening in Excel..." -ForegroundColor Green
} catch {
    Write-Host "Please open the CSV file manually in Excel" -ForegroundColor Yellow
}
