import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

test('test', async ({ page }) => {
    // Automatically seed the database before running the test to ensure clean state
    try {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const serverDir = path.resolve(__dirname, '../../server');
        execSync('node seed.js', { cwd: serverDir });
    } catch (error) {
        console.error('Database seeding failed:', error);
    }

    await page.goto('http://localhost:3000/login');
    await page.getByRole('textbox', { name: 'Enter your email' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill('student@lab.com');
    await page.getByRole('textbox', { name: '••••••••' }).click();
    await page.getByRole('textbox', { name: '••••••••' }).fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('button', { name: 'Add to Request' }).first().click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: 'Add to Request' }).nth(5).click();
    await page.getByRole('link', { name: 'My Rentals' }).click();
    await page.getByRole('link', { name: 'Verify Labs' }).click();
    await page.getByRole('link', { name: 'Lectures' }).click();
    await page.getByRole('button', { name: 'Request Verification' }).click();
    await page.getByRole('checkbox', { name: 'Teacher User teacher' }).check();
    await page.getByRole('checkbox', { name: 'Teacher User teacher' }).uncheck();
    await page.getByRole('checkbox', { name: 'Teacher User teacher' }).check();
    await page.getByRole('button', { name: 'Submit Request' }).click();
    await page.getByRole('link', { name: 'Labs', exact: true }).click();
    await page.getByRole('link', { name: 'Lectures' }).click();
    await page.getByRole('link', { name: 'Catalog' }).click();
    await page.getByRole('button').nth(2).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill('teacher@lab.com');
    await page.getByRole('textbox', { name: '••••••••' }).click();
    await page.getByRole('textbox', { name: '••••••••' }).fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.getByRole('button', { name: 'Lectures' }).click();
    await page.getByRole('button', { name: 'Lab Verification' }).click();
    await page.getByRole('button', { name: 'Approve' }).first().click();
    await page.getByRole('button', { name: 'Approve' }).nth(1).click();
    await page.getByRole('button', { name: 'History (1)' }).click();
    await page.getByRole('button', { name: 'Manage Users' }).click();
    await page.getByRole('button', { name: 'Manage Labs' }).click();
    await page.getByRole('button', { name: 'Overview & Rentals' }).click();
});