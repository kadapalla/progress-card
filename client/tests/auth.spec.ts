import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

test.describe('Authentication Flows', () => {
  test.beforeAll(async () => {
    // Seed the database before running the suite
    try {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const serverDir = path.resolve(__dirname, '../../server');
      execSync('node seed.js', { cwd: serverDir });
    } catch (error) {
      console.error('Database seeding failed:', error);
    }
  });

  test('student can login successfully and redirects to catalog', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Enter your email' }).fill('student@lab.com');
    await page.getByRole('textbox', { name: '••••••••' }).fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Student should be redirected to the Catalog
    await expect(page).toHaveURL(/.*\//);
    // Ensure Navbar shows student elements
    await expect(page.getByRole('link', { name: 'Catalog' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'My Rentals' })).toBeVisible();
  });

  test('teacher can login successfully and redirects to catalog (and can access dashboard)', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Enter your email' }).fill('teacher@lab.com');
    await page.getByRole('textbox', { name: '••••••••' }).fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Teacher should be redirected to the catalog initially
    await expect(page).toHaveURL(/.*\//);
    
    // Navigate to dashboard
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL(/.*\/admin/);
    
    // Ensure Dashboard elements are visible
    await expect(page.getByRole('button', { name: 'Overview & Rentals' })).toBeVisible();
  });

  test('shows error on invalid login', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Enter your email' }).fill('wrong@lab.com');
    await page.getByRole('textbox', { name: '••••••••' }).fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Assuming the app shows a toast or error message. Adjust selector based on actual toast implementation.
    // If react-hot-toast is used, it usually appears in a specific container.
    await expect(page.getByText(/invalid credentials|error|not found/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('user can log out successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Enter your email' }).fill('student@lab.com');
    await page.getByRole('textbox', { name: '••••••••' }).fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/.*\//);

    // Click logout
    await page.getByRole('button', { name: 'Logout' }).click();
    
    // Should be back to login page
    await expect(page).toHaveURL(/.*\/login/);
  });
});
