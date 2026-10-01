$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$content = (Get-Content (Join-Path $root 'src/data/works.ts') -Raw) + (Get-Content (Join-Path $root 'src/data/legacy-works.json') -Raw)
$ids = [regex]::Matches($content, '(?:youtube\.com/watch\?v=|youtu\.be/)([A-Za-z0-9_-]{11})') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique -CaseSensitive
$results = @{}
$failed = @()
foreach ($id in $ids) {
  try {
    $html = (Invoke-WebRequest "https://www.youtube.com/watch?v=$id" -TimeoutSec 25).Content
    $match = [regex]::Match($html, '"publishDate"\s*:\s*"([^"]+)"')
    if (!$match.Success) { throw 'Publication date unavailable' }
    $date = [DateTimeOffset]::Parse($match.Groups[1].Value)
    $results[$id] = $date.ToUniversalTime().ToString('o')
  } catch { $failed += $id }
}
@{ dates = $results; unavailable = $failed } | ConvertTo-Json -Depth 3
