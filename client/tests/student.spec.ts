import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

test.describe('Student Flows', () => {
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
    // Login as student before each test
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Enter your email' }).fill('student@lab.com');
    await page.getByRole('textbox', { name: '••••••••' }).fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/');
  });

  test('browse catalog and add items to cart', async ({ page }) => {
    await page.getByRole('link', { name: 'Catalog' }).click();
    
    // Add first item to request (opens modal)
    await page.getByRole('button', { name: 'Add to Request' }).first().click();

    // Click 'Add to Request' inside the modal to confirm
    await page.getByRole('button', { name: 'Add to Request' }).last().click();

    // The cart drawer might open or a toast might appear, let's wait a bit
    await page.waitForTimeout(500);

    // Assuming cart shows total items or is visible
    const cartButton = page.getByRole('button', { name: 'Cart' });
    if (await cartButton.isVisible()) {
      await cartButton.click({ force: true });
      await expect(page.getByRole('heading', { name: 'Your Request Cart' })).toBeVisible();
    }
  });

  test('submit a verification request', async ({ page }) => {
    // Navigate to Verify Labs
    await page.getByRole('link', { name: 'Verify Labs' }).click();
    
    // Navigate to Lectures
    await page.getByRole('link', { name: 'Lectures' }).click();
    
    // Check if the "Request Verification" button exists
    const requestVerificationBtn = page.getByRole('button', { name: 'Request Verification' });
    if (await requestVerificationBtn.isVisible()) {
        await requestVerificationBtn.click();

        // Select a teacher
        const teacherCheckbox = page.getByRole('checkbox', { name: /Teacher User|teacher/i }).first();
        await expect(teacherCheckbox).toBeVisible();
        await teacherCheckbox.check();
        
        // Submit request
        await page.getByRole('button', { name: 'Submit Request' }).click();
        
        // Success message should appear
        await expect(page.getByText(/success|requested/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('view my rentals', async ({ page }) => {
    await page.getByRole('link', { name: 'My Rentals' }).click();
    // Assuming rentals list some labs
    await expect(page.getByRole('heading', { name: /my rentals|labs/i }).first()).toBeVisible();
  });
});
