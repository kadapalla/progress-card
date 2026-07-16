# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: teacher.spec.ts >> Teacher Flows >> view and interact with dashboard tabs
- Location: client\tests\teacher.spec.ts:26:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
Call log:
  - navigating to "http://localhost:3000/login", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { execSync } from 'child_process';
  3  | import { fileURLToPath } from 'url';
  4  | import path from 'path';
  5  | 
  6  | test.describe('Teacher Flows', () => {
  7  |   test.beforeAll(async () => {
  8  |     try {
  9  |       const __dirname = path.dirname(fileURLToPath(import.meta.url));
  10 |       const serverDir = path.resolve(__dirname, '../../server');
  11 |       execSync('node seed.js', { cwd: serverDir });
  12 |     } catch (error) {
  13 |       console.error('Database seeding failed:', error);
  14 |     }
  15 |   });
  16 | 
  17 |   test.beforeEach(async ({ page }) => {
  18 |     // Login as teacher before each test
> 19 |     await page.goto('/login');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
  20 |     await page.getByRole('textbox', { name: 'Enter your email' }).fill('teacher@lab.com');
  21 |     await page.getByRole('textbox', { name: '••••••••' }).fill('password123');
  22 |     await page.getByRole('button', { name: 'Sign In' }).click();
  23 |     await page.waitForURL(/.*\/teacher\/.*/);
  24 |   });
  25 | 
  26 |   test('view and interact with dashboard tabs', async ({ page }) => {
  27 |     // We should be on dashboard
  28 |     await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  29 | 
  30 |     // Check all main tabs
  31 |     await page.getByRole('button', { name: 'Lectures' }).click();
  32 |     await expect(page.getByRole('heading', { name: /lectures/i }).first()).toBeVisible();
  33 | 
  34 |     await page.getByRole('button', { name: 'Lab Verification' }).click();
  35 |     await expect(page.getByRole('heading', { name: /verification/i }).first()).toBeVisible();
  36 | 
  37 |     await page.getByRole('button', { name: 'Manage Users' }).click();
  38 |     await expect(page.getByRole('heading', { name: /users/i }).first()).toBeVisible();
  39 | 
  40 |     await page.getByRole('button', { name: 'Manage Labs' }).click();
  41 |     await expect(page.getByRole('heading', { name: /labs/i }).first()).toBeVisible();
  42 | 
  43 |     await page.getByRole('button', { name: 'Overview & Rentals' }).click();
  44 |     await expect(page.getByRole('heading', { name: /overview/i }).first()).toBeVisible();
  45 |   });
  46 | 
  47 |   test('approve a lab verification request', async ({ page }) => {
  48 |     await page.getByRole('button', { name: 'Lab Verification' }).click();
  49 |     
  50 |     // There might be a pending request from seed data. Let's try to approve the first one.
  51 |     const approveButtons = page.getByRole('button', { name: 'Approve' });
  52 |     if (await approveButtons.count() > 0) {
  53 |       await approveButtons.first().click();
  54 |       
  55 |       // Look for a history tab to see it moved there
  56 |       const historyTab = page.getByRole('button', { name: /History/i });
  57 |       if (await historyTab.isVisible()) {
  58 |           await historyTab.click();
  59 |           await expect(page.getByText(/approved/i).first()).toBeVisible();
  60 |       }
  61 |     }
  62 |   });
  63 | });
  64 | 
```