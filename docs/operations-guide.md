# Operations Guide

> **FormsApp - Development & Operations Manual**
> **Last Updated:** 2026-01-15

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Starting the Server](#starting-the-server)
4. [Running Tests](#running-tests)
5. [Building for Production](#building-for-production)
6. [Stopping Services](#stopping-services)
7. [Troubleshooting](#troubleshooting)
8. [Quick Reference](#quick-reference)

---

## Prerequisites

### Required Software

| Software | Minimum Version | Check Command |
|----------|-----------------|---------------|
| Node.js | 18.x or higher | `node --version` |
| npm | 9.x or higher | `npm --version` |
| Git | 2.x or higher | `git --version` |

### Recommended

| Software | Purpose |
|----------|---------|
| VS Code | IDE with Vue extensions |
| Vue DevTools | Browser extension for debugging |

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd formsApp
```

### 2. Install Dependencies

```bash
npm install
```

**Expected output:**
```
added 96 packages, and audited 143 packages in 3s
```

### 3. Verify Installation

```bash
npm run test:run
```

**Expected output:**
```
Test Files  3 passed (3)
     Tests  61 passed (61)
```

---

## Starting the Server

### Development Server

**Start:**
```bash
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Access the application:**
- Open browser to: `http://localhost:5173`

**Server runs on:**
- Default port: `5173`
- Hot Module Replacement (HMR) enabled
- Auto-refresh on file changes

### Production Preview Server

**Start:**
```bash
npm run build && npm run preview
```

**Expected output:**
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
```

**Access the application:**
- Open browser to: `http://localhost:4173`

---

## Running Tests

### All Tests (Watch Mode)

```bash
npm test
```

**Behavior:**
- Runs tests continuously
- Re-runs on file changes
- Press `q` to quit
- Press `a` to run all tests
- Press `f` to run only failed tests

### All Tests (Single Run)

```bash
npm run test:run
```

**Use for:** CI/CD pipelines, quick validation

### Tests with Coverage Report

```bash
npm run test:coverage
```

**Output:**
- Console summary
- HTML report in `coverage/` directory
- Open `coverage/index.html` in browser for detailed view

### Test UI (Visual Interface)

```bash
npm run test:ui
```

**Access:** Opens browser with interactive test dashboard

---

## Building for Production

### Create Production Build

```bash
npm run build
```

**Output directory:** `dist/`

**Contents:**
```
dist/
├── index.html
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

### Verify Build Artifacts

```bash
ls -la dist/
ls -la dist/assets/
```

### Check Bundle Size

```bash
du -sh dist/
du -sh dist/assets/*.js
```

**Expected sizes:**
- Total: ~270KB
- JS bundle: ~205KB (gzipped: ~66KB)
- CSS: ~58KB (gzipped: ~8KB)

---

## Stopping Services

### Stop Development Server

**Method 1: Keyboard**
```
Press Ctrl + C in the terminal running the server
```

**Method 2: Kill by Port**
```bash
# Find process on port 5173
lsof -i :5173

# Kill process
kill -9 <PID>

# Or one-liner
kill -9 $(lsof -t -i:5173)
```

### Stop Preview Server

```bash
# Press Ctrl + C in terminal
# Or kill by port
kill -9 $(lsof -t -i:4173)
```

### Stop Test Runner

```bash
# In watch mode, press 'q' to quit
# Or press Ctrl + C
```

### Stop All Node Processes (Emergency)

```bash
# Kill all node processes (use with caution)
pkill -f node

# Or more targeted
pkill -f vite
pkill -f vitest
```

### Clean Up

```bash
# Remove build artifacts
rm -rf dist/

# Remove node modules (full reinstall needed)
rm -rf node_modules/

# Remove test coverage
rm -rf coverage/

# Remove all generated files
rm -rf dist/ node_modules/ coverage/
```

---

## Background Processes

### Run Dev Server in Background

```bash
# Start in background
npm run dev > /dev/null 2>&1 &

# Get the process ID
echo $!

# Or use nohup for persistent background
nohup npm run dev > dev.log 2>&1 &
```

### Check Running Processes

```bash
# Check for Vite processes
ps aux | grep vite

# Check ports in use
lsof -i :5173
lsof -i :4173

# Check all node processes
ps aux | grep node
```

### Stop Background Processes

```bash
# Find and kill by port
kill -9 $(lsof -t -i:5173)

# Or by process name
pkill -f "vite"
```

---

## Environment Variables

### Development

Create `.env.local` for local overrides:

```bash
# .env.local (git-ignored)
VITE_API_URL=http://localhost:8080
VITE_DEBUG=true
```

### Production

Create `.env.production` for production settings:

```bash
# .env.production
VITE_API_URL=https://api.yoursite.com
VITE_DEBUG=false
```

---

## Troubleshooting

### Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5173
```

**Solution:**
```bash
# Find and kill process on port
kill -9 $(lsof -t -i:5173)

# Then restart
npm run dev
```

### Node Modules Issues

**Solution:**
```bash
# Remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Fails

**Check for errors:**
```bash
npm run build 2>&1 | head -50
```

**Common fixes:**
```bash
# Clear cache
rm -rf node_modules/.vite

# Reinstall dependencies
rm -rf node_modules && npm install
```

### Tests Fail

**Run with verbose output:**
```bash
npm run test:run -- --reporter=verbose
```

**Run specific test file:**
```bash
npx vitest run tests/unit/stores/formBuilder.spec.js
```

### Permission Denied

**Solution:**
```bash
# Fix permissions
chmod -R 755 node_modules/.bin/
```

---

## Quick Reference

### Command Cheat Sheet

| Action | Command |
|--------|---------|
| Install dependencies | `npm install` |
| Start dev server | `npm run dev` |
| Stop dev server | `Ctrl + C` |
| Run all tests | `npm run test:run` |
| Run tests (watch) | `npm test` |
| Run tests with coverage | `npm run test:coverage` |
| Build for production | `npm run build` |
| Preview production build | `npm run preview` |
| Stop any server | `Ctrl + C` |
| Kill port 5173 | `kill -9 $(lsof -t -i:5173)` |
| Kill port 4173 | `kill -9 $(lsof -t -i:4173)` |
| Clean all | `rm -rf dist/ node_modules/ coverage/` |

### Port Reference

| Service | Port | URL |
|---------|------|-----|
| Dev Server | 5173 | http://localhost:5173 |
| Preview Server | 4173 | http://localhost:4173 |
| Test UI | 51204 | http://localhost:51204 |

### File Locations

| Item | Path |
|------|------|
| Source code | `src/` |
| Tests | `tests/` |
| Build output | `dist/` |
| Coverage report | `coverage/` |
| Documentation | `docs/` |
| Config files | Root directory |

---

## Scripts Reference

From `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Health Check Script

Create a quick health check:

```bash
#!/bin/bash
# health-check.sh

echo "=== FormsApp Health Check ==="

echo -n "Node version: "
node --version

echo -n "npm version: "
npm --version

echo "Checking dependencies..."
npm ls --depth=0 2>/dev/null | head -10

echo "Running tests..."
npm run test:run

echo "Building..."
npm run build

echo "=== Health Check Complete ==="
```

Run with:
```bash
chmod +x health-check.sh
./health-check.sh
```

---

*Document generated as part of FormsApp documentation.*
*For issues, check the troubleshooting section or create a GitHub issue.*
