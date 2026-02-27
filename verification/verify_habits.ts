import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the Habits page
    await page.goto('http://localhost:3000/dashboard/habits');

    // Wait for the page content to load
    await page.waitForSelector('h2:has-text("Atomic Habits")');

    // Handle Clerk/Organization Modal if it appears
    try {
        await page.waitForSelector('button:has-text("I\'ll remove it myself")', { timeout: 5000 });
        await page.click('button:has-text("I\'ll remove it myself")');
    } catch (e) {
        console.log("Organization modal did not appear or was not handled.");
    }

    // Close any other potential modals
    try {
       await page.keyboard.press('Escape');
    } catch(e) {}


    // Test Identity Header
    await page.click('button:has(.lucide-pencil)'); // Click edit button
    await page.fill('input[value="I am someone who..."]', 'I am a disciplined developer');
    await page.click('button:has(.lucide-check)'); // Click save button
    await page.waitForSelector('h1:has-text("I am a disciplined developer")');

    // Test Adding a Habit
    await page.click('button:has-text("Add Habit")');
    // Wait for dialog to open
    await page.waitForSelector('div[role="dialog"]');

    // Use more specific selector or wait a bit
    await page.waitForTimeout(500);
    await page.fill('input[placeholder="Habit Name"]', 'Code Daily');

    // Select type using Shadcn Select
    // The placeholder is "Type". We need to find the specific trigger in the dialog.
    // The dialog content is usually in a div with role="dialog".
    const dialog = page.locator('div[role="dialog"]');
    await dialog.locator('button[role="combobox"]').click();

    await page.click('div[role="option"]:has-text("Positive (+)")');

    await dialog.locator('button:has-text("Save Habit")').click();

    // Wait for habit to appear in table
    await page.waitForSelector('td:has-text("Code Daily")');

    // Test Logging a Habit
    // Find the row with "Code Daily" and then the button inside it
    const row = page.locator('tr:has-text("Code Daily")');
    await row.locator('button:has(.lucide-plus)').click();

    // Take a screenshot after interactions
    await page.screenshot({ path: 'verification/habits_interacted.png', fullPage: true });

  } catch (error) {
    console.error('Error:', error);
    await page.screenshot({ path: 'verification/error_state.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();
