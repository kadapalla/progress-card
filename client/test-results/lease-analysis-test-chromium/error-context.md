# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lease-analysis.spec.ts >> test
- Location: tests\lease-analysis.spec.ts:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Request Verification' })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img [ref=e8]
        - generic "Kadapalla Lab Management System" [ref=e10]: KalaM
      - generic [ref=e11]:
        - button "Toggle theme" [ref=e12] [cursor=pointer]:
          - img [ref=e13]
        - generic [ref=e15]:
          - generic [ref=e16]:
            - link "Catalog" [ref=e17] [cursor=pointer]:
              - /url: /
            - link "Lectures" [active] [ref=e18] [cursor=pointer]:
              - /url: /lectures
            - link "Labs" [ref=e19] [cursor=pointer]:
              - /url: /labs
            - link "My Rentals" [ref=e20] [cursor=pointer]:
              - /url: /rentals
              - img [ref=e21]
              - text: My Rentals
            - link "Verify Labs" [ref=e25] [cursor=pointer]:
              - /url: /verify-labs
          - generic [ref=e26]:
            - button "2" [ref=e27] [cursor=pointer]:
              - img [ref=e28]
              - generic [ref=e32]: "2"
            - generic [ref=e34]: ₹500.00
            - generic [ref=e35]:
              - generic [ref=e36]: John Doe
              - generic [ref=e37]: student
            - button [ref=e38] [cursor=pointer]:
              - img [ref=e39]
  - main [ref=e42]:
    - generic [ref=e43]:
      - generic [ref=e44]:
        - heading "Lectures & Experiments" [level=1] [ref=e45]
        - paragraph [ref=e46]: Watch lectures and easily request the required equipment.
      - generic [ref=e47]:
        - generic [ref=e48]:
          - heading "Available Lectures" [level=2] [ref=e49]
          - generic [ref=e50]:
            - combobox [ref=e52]:
              - option "All Languages" [selected]
              - option "English"
              - option "Hindi"
              - option "Telugu"
            - combobox [ref=e54]:
              - option "All Levels" [selected]
              - option "Beginner"
              - option "Intermediate"
              - option "Advanced"
            - combobox [ref=e56]:
              - option "All Departments" [selected]
              - option "Electronics"
              - option "Mechanical"
              - option "Computer Science"
              - option "Civil"
              - option "Electrical"
          - generic [ref=e57]:
            - generic [ref=e59] [cursor=pointer]:
              - heading "Introduction to Arduino" [level=3] [ref=e60]:
                - generic [ref=e61]:
                  - img [ref=e62]
                  - generic [ref=e65]: Introduction to Arduino
              - generic [ref=e66]:
                - generic [ref=e67]: English
                - generic [ref=e68]: Beginner
                - generic [ref=e69]: Electronics
            - generic [ref=e71] [cursor=pointer]:
              - heading "Advanced Sensor Integration Locked" [level=3] [ref=e72]:
                - generic [ref=e73]:
                  - img [ref=e74]
                  - generic [ref=e77]: Advanced Sensor Integration
                - generic [ref=e78]: Locked
              - generic [ref=e79]:
                - generic [ref=e80]: English
                - generic [ref=e81]: Intermediate
                - generic [ref=e82]: Electronics
        - generic [ref=e84]:
          - iframe [ref=e86]:
            - generic [active] [ref=f1e1]:
              - generic "YouTube Video Player" [ref=f1e3]
              - generic [ref=f1e5]:
                - generic:
                  - generic:
                    - button "Play video" [ref=f1e10] [cursor=pointer]:
                      - generic [ref=f1e13]:
                        - img
                    - button "Hide player controls" [ref=f1e14] [cursor=pointer]
                    - generic [ref=f1e16]:
                      - generic [ref=f1e21]:
                        - generic [ref=f1e22]:
                          - link "You can learn Arduino in 15 minutes." [ref=f1e23] [cursor=pointer]:
                            - /url: https://www.youtube.com/watch?v=nL34zDTPkcs
                          - link "Afrotechmods" [ref=f1e24] [cursor=pointer]:
                            - /url: /channel/UCosnWgi3eorc1klEQ8pIgJQ
                            - generic [ref=f1e25]: Afrotechmods
                        - generic [ref=f1e26]:
                          - button "thumbnail-image" [ref=f1e27] [cursor=pointer]:
                            - img "thumbnail-image" [ref=f1e28]
                          - generic [ref=f1e30]:
                            - generic: Afrotechmods
                            - generic: 814K subscribers
                      - generic [ref=f1e31]:
                        - button "Share" [ref=f1e34] [cursor=pointer]:
                          - generic [ref=f1e38]:
                            - img
                        - link "Watch on YouTube" [ref=f1e45] [cursor=pointer]:
                          - /url: https://www.youtube.com/watch?v=nL34zDTPkcs
                          - generic [ref=f1e48]:
                            - text: Watch on
                            - img [ref=f1e50]:
                              - generic [ref=f1e52]:
                                - img
          - generic [ref=e87]:
            - generic [ref=e88]:
              - heading "Introduction to Arduino" [level=3] [ref=e89]
              - paragraph [ref=e90]: Learn the basics of Arduino programming and circuit design.
            - generic [ref=e92]:
              - generic [ref=e93]:
                - img [ref=e94]
                - text: Pending Verification
              - generic [ref=e97]:
                - generic [ref=e98]:
                  - generic [ref=e99]: "Student DA:"
                  - generic [ref=e100]: da-verified
                - generic [ref=e101]:
                  - generic [ref=e102]: "Teacher:"
                  - generic [ref=e103]: pending
                - generic [ref=e104]:
                  - generic [ref=e105]: "Admin:"
                  - generic [ref=e106]: pending
              - generic [ref=e107]: "Assigned: Teacher User (TEACHER)"
          - generic [ref=e108]:
            - generic [ref=e109]:
              - generic [ref=e110]:
                - heading "Required Equipment" [level=3] [ref=e111]
                - button "Add All to Request" [ref=e112] [cursor=pointer]
              - generic [ref=e113]:
                - generic [ref=e114]:
                  - generic [ref=e115]:
                    - img "Arduino Uno R3" [ref=e116]
                    - generic [ref=e117]:
                      - paragraph [ref=e118]: Arduino Uno R3
                      - paragraph [ref=e119]: "Available: 12"
                  - button "Add" [ref=e120] [cursor=pointer]
                - generic [ref=e121]:
                  - generic [ref=e122]:
                    - img "Jumper Wires (M-M)" [ref=e123]
                    - generic [ref=e124]:
                      - paragraph [ref=e125]: Jumper Wires (M-M)
                      - paragraph [ref=e126]: "Available: 450"
                  - button "Add" [ref=e127] [cursor=pointer]
            - generic [ref=e128]:
              - heading "Verification History" [level=3] [ref=e129]
              - generic [ref=e131]:
                - generic [ref=e132]:
                  - generic [ref=e133]: "Attempt #1"
                  - generic [ref=e134]: pending
                - generic [ref=e135]:
                  - generic [ref=e136]:
                    - generic [ref=e137]: "Student DA:"
                    - generic [ref=e138]: da-verified
                  - generic [ref=e139]:
                    - generic [ref=e140]: "Teacher:"
                    - generic [ref=e141]: pending
                  - generic [ref=e142]:
                    - generic [ref=e143]: "Admin:"
                    - generic [ref=e144]: pending
                - generic [ref=e145]:
                  - generic [ref=e146]: "Submitted: Jun 25, 2026 8:09 PM"
                  - generic [ref=e147]: "Assigned: Teacher User"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('test', async ({ page }) => {
  4  |     await page.goto('/login');
  5  |     await page.getByRole('textbox', { name: 'Enter your email' }).click();
  6  |     await page.getByRole('textbox', { name: 'Enter your email' }).fill('student@lab.com');
  7  |     await page.getByRole('textbox', { name: '••••••••' }).click();
  8  |     await page.getByRole('textbox', { name: '••••••••' }).fill('password123');
  9  |     await page.getByRole('button', { name: 'Sign In' }).click();
  10 |     await page.getByRole('button', { name: 'Add to Request' }).first().click();
  11 |     await page.getByRole('button', { name: '+' }).click();
  12 |     await page.getByRole('button', { name: 'Add to Request' }).nth(5).click();
  13 |     await page.getByRole('link', { name: 'My Rentals' }).click();
  14 |     await page.getByRole('link', { name: 'Verify Labs' }).click();
  15 |     await page.getByRole('link', { name: 'Lectures' }).click();
> 16 |     await page.getByRole('button', { name: 'Request Verification' }).click();
     |                                                                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  17 |     await page.getByRole('checkbox', { name: 'Teacher User teacher' }).check();
  18 |     await page.getByRole('checkbox', { name: 'Teacher User teacher' }).uncheck();
  19 |     await page.getByRole('checkbox', { name: 'Teacher User teacher' }).check();
  20 |     await page.getByRole('button', { name: 'Submit Request' }).click();
  21 |     await page.getByRole('link', { name: 'Labs', exact: true }).click();
  22 |     await page.getByRole('link', { name: 'Lectures' }).click();
  23 |     await page.getByRole('link', { name: 'Catalog' }).click();
  24 |     await page.getByRole('button').nth(2).click();
  25 |     await page.getByRole('textbox', { name: 'Enter your email' }).click();
  26 |     await page.getByRole('textbox', { name: 'Enter your email' }).fill('teacher@lab.com');
  27 |     await page.getByRole('textbox', { name: '••••••••' }).click();
  28 |     await page.getByRole('textbox', { name: '••••••••' }).fill('password123');
  29 |     await page.getByRole('button', { name: 'Sign In' }).click();
  30 |     await page.getByRole('link', { name: 'Dashboard' }).click();
  31 |     await page.getByRole('button', { name: 'Lectures' }).click();
  32 |     await page.getByRole('button', { name: 'Lab Verification' }).click();
  33 |     await page.getByRole('button', { name: 'Approve' }).first().click();
  34 |     await page.getByRole('button', { name: 'Approve' }).nth(1).click();
  35 |     await page.getByRole('button', { name: 'History (1)' }).click();
  36 |     await page.getByRole('button', { name: 'Manage Users' }).click();
  37 |     await page.getByRole('button', { name: 'Manage Labs' }).click();
  38 |     await page.getByRole('button', { name: 'Overview & Rentals' }).click();
  39 | });
```