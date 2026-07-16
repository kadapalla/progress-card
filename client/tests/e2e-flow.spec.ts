import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

test.describe('End-to-End Complete Flow', () => {
  test.beforeAll(async () => {
    try {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const serverDir = path.resolve(__dirname, '../../server');
      execSync('node seed.js', { cwd: serverDir });
    } catch (error) {
      console.error('Database seeding failed:', error);
    }
  });

  test('Student request to Teacher approval lifecycle', async ({ browser }) => {
    // We use isolated contexts for Student and Teacher to avoid session conflicts
    const studentContext = await browser.newContext();
    const studentPage = await studentContext.newPage();

    const teacherContext = await browser.newContext();
    const teacherPage = await teacherContext.newPage();

    // 1. Student Login
    await studentPage.goto('/login');
    await studentPage.getByRole('textbox', { name: 'Enter your email' }).fill('student@lab.com');
    await studentPage.getByRole('textbox', { name: '••••••••' }).fill('password123');
    await studentPage.getByRole('button', { name: 'Sign In' }).click();
    await studentPage.waitForURL('**/');

    // 2. Student adds items to Request
    await studentPage.getByRole('link', { name: 'Catalog' }).click();
    
    // Add first item to request (opens modal)
    await studentPage.getByRole('button', { name: 'Add to Request' }).first().click();
    
    // Click 'Add to Request' inside the modal to confirm
    await studentPage.getByRole('button', { name: 'Add to Request' }).last().click();
    

    // 3. Student requests verification
    await studentPage.getByRole('link', { name: 'Verify Labs' }).click();
    await studentPage.getByRole('link', { name: 'Lectures' }).click();
    
    const requestVerificationBtn = studentPage.getByRole('button', { name: 'Request Verification' });
    if (await requestVerificationBtn.isVisible()) {
        await requestVerificationBtn.click();
        
        const teacherCheckbox = studentPage.getByRole('checkbox', { name: /Teacher User|teacher/i }).first();
        await expect(teacherCheckbox).toBeVisible();
        await teacherCheckbox.check();
        
        await studentPage.getByRole('button', { name: 'Submit Request' }).click();
        await expect(studentPage.getByText(/success|requested/i)).toBeVisible({ timeout: 5000 });
    }

    // 4. Teacher Login
    await teacherPage.goto('/login');
    await teacherPage.getByRole('textbox', { name: 'Enter your email' }).fill('teacher@lab.com');
    await teacherPage.getByRole('textbox', { name: '••••••••' }).fill('password123');
    await teacherPage.getByRole('button', { name: 'Sign In' }).click();
    await teacherPage.waitForURL('**/');
    await teacherPage.getByRole('link', { name: 'Dashboard' }).click();
    await teacherPage.waitForURL('**/admin');

    // 5. Teacher Approves Verification
    await teacherPage.getByRole('button', { name: 'Lab Verification' }).click();
    const approveButtons = teacherPage.getByRole('button', { name: 'Approve' });
    if (await approveButtons.count() > 0) {
        await approveButtons.first().click();
        
        // Wait for it to move to history
        await teacherPage.getByRole('button', { name: /History/i }).click();
        await expect(teacherPage.getByText(/approved/i).first()).toBeVisible();
    }

    // Cleanup
    await studentContext.close();
    await teacherContext.close();
  });
});
