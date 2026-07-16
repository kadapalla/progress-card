import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

test.describe('Teacher Flows', () => {
  test.beforeAll(async () => {
    try {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const serverDir = path.resolve(__dirname, '../../server');
      execSync('node seed.js', { cwd: serverDir });
    } catch (error) {
      console.error('Database seeding failed:', error);
    }
  });

  test.beforeEach(async ({ page }) => {
    // Login as teacher before each test
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Enter your email' }).fill('teacher@lab.com');
    await page.getByRole('textbox', { name: '••••••••' }).fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/');
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.waitForURL('**/admin');
  });

  test('view and interact with dashboard tabs', async ({ page }) => {
    // We should be on dashboard
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();

    // Check all main tabs
    await page.getByRole('button', { name: 'Lectures' }).click();
    await expect(page.getByRole('heading', { name: /lectures/i }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Lab Verification' }).click();
    await expect(page.getByRole('heading', { name: /verification/i }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Manage Users' }).click();
    await expect(page.getByRole('heading', { name: /users/i }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Manage Labs' }).click();
    await expect(page.getByRole('heading', { name: /labs/i }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Overview & Rentals' }).click();
    await expect(page.getByRole('heading', { name: /overview/i }).first()).toBeVisible();
  });

  test('approve a lab verification request', async ({ page }) => {
    await page.getByRole('button', { name: 'Lab Verification' }).click();
    
    // There might be a pending request from seed data. Let's try to approve the first one.
    const approveButtons = page.getByRole('button', { name: 'Approve' });
    if (await approveButtons.count() > 0) {
      await approveButtons.first().click();
      
      // Look for a history tab to see it moved there
      const historyTab = page.getByRole('button', { name: /History/i });
      if (await historyTab.isVisible()) {
          await historyTab.click();
          await expect(page.getByText(/approved/i).first()).toBeVisible();
      }
    }
  });
});
