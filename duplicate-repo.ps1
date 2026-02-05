# Repository Duplication Script
# This script creates a new unified repository with both frontend and backend code

param(
    [Parameter(Mandatory=$false)]
    [string]$NewRepoName = "Virtual-Film-Office-Academy-Full",
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubUsername = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipGitInit = $false
)

# Colors for output
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Error { Write-Host $args -ForegroundColor Red }

Write-Info "=========================================="
Write-Info "Repository Duplication Script"
Write-Info "=========================================="
Write-Info ""

# Get current directory
$SourceDir = Get-Location
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$NewRepoPath = Join-Path $DesktopPath $NewRepoName

Write-Info "Source Directory: $SourceDir"
Write-Info "New Repository Path: $NewRepoPath"
Write-Info ""

# Check if destination already exists
if (Test-Path $NewRepoPath) {
    Write-Warning "Directory '$NewRepoPath' already exists!"
    $response = Read-Host "Do you want to delete it and continue? (yes/no)"
    if ($response -ne "yes") {
        Write-Error "Operation cancelled."
        exit 1
    }
    Write-Info "Removing existing directory..."
    Remove-Item -Recurse -Force $NewRepoPath
}

# Create new directory
Write-Info "Creating new directory..."
New-Item -ItemType Directory -Path $NewRepoPath | Out-Null
Write-Success "✓ Directory created"

# Copy files
Write-Info "Copying files (this may take a moment)..."
$excludeDirs = @('.git', 'node_modules', '.next')

Get-ChildItem -Path $SourceDir -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Substring($SourceDir.Path.Length + 1)
    
    # Skip excluded directories
    $skip = $false
    foreach ($exclude in $excludeDirs) {
        if ($relativePath -like "$exclude*") {
            $skip = $true
            break
        }
    }
    
    if (-not $skip) {
        $destPath = Join-Path $NewRepoPath $relativePath
        
        if ($_.PSIsContainer) {
            if (-not (Test-Path $destPath)) {
                New-Item -ItemType Directory -Path $destPath -Force | Out-Null
            }
        } else {
            Copy-Item -Path $_.FullName -Destination $destPath -Force
        }
    }
}

Write-Success "✓ Files copied successfully"

# Initialize Git repository
if (-not $SkipGitInit) {
    Write-Info "Initializing Git repository..."
    Set-Location $NewRepoPath
    
    git init
    Write-Success "✓ Git repository initialized"
    
    # Create initial commit
    Write-Info "Creating initial commit..."
    git add .
    git commit -m "Initial commit: Full-stack Virtual Film Office Academy with frontend and backend"
    Write-Success "✓ Initial commit created"
    
    # Setup remote if GitHub username provided
    if ($GitHubUsername) {
        $remoteUrl = "https://github.com/$GitHubUsername/$NewRepoName.git"
        Write-Info "Adding remote origin: $remoteUrl"
        git remote add origin $remoteUrl
        git branch -M main
        Write-Success "✓ Remote origin configured"
        Write-Warning ""
        Write-Warning "IMPORTANT: Make sure you've created the repository on GitHub first!"
        Write-Warning "Then run: git push -u origin main"
    } else {
        Write-Warning ""
        Write-Warning "GitHub username not provided. To add remote later, run:"
        Write-Warning "git remote add origin https://github.com/YOUR_USERNAME/$NewRepoName.git"
        Write-Warning "git branch -M main"
        Write-Warning "git push -u origin main"
    }
}

Write-Info ""
Write-Success "=========================================="
Write-Success "Repository duplication completed!"
Write-Success "=========================================="
Write-Info ""
Write-Info "New repository location: $NewRepoPath"
Write-Info ""
Write-Info "Next steps:"
Write-Info "1. Create a new repository on GitHub named: $NewRepoName"
Write-Info "2. Navigate to: cd '$NewRepoPath'"
if (-not $GitHubUsername) {
    Write-Info "3. Add remote: git remote add origin https://github.com/YOUR_USERNAME/$NewRepoName.git"
    Write-Info "4. Push code: git push -u origin main"
} else {
    Write-Info "3. Push code: git push -u origin main"
}
Write-Info "5. Follow the deployment guide in DEPLOYMENT_GUIDE.md"
Write-Info ""

# Return to original directory
Set-Location $SourceDir
