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
        // console.log("Organization modal did not appear or was not handled.");
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
    const dialog = page.locator('div[role="dialog"]');
    await dialog.locator('button[role="combobox"]').click();
    await page.click('div[role="option"]:has-text("Positive (+)")');
    await dialog.locator('button:has-text("Save Habit")').click();

    // Wait for habit to appear in table
    await page.waitForSelector('td:has-text("Code Daily")');

    // Test "Never Miss Twice" - verify habit appears
    await page.waitForSelector('div:has-text("Never Miss Twice")');
    await page.waitForSelector('span:has-text("Code Daily")');

    // Test Logging a Habit with Trigger
    const row = page.locator('tr:has-text("Code Daily")');
    // Click the plus button which is now a popover trigger
    await row.locator('button:has(.lucide-plus)').click();

    // Wait for popover content
    await page.waitForSelector('h4:has-text("Log Completion")');

    // Select Trigger
    await page.click('button:has-text("Select trigger")');
    await page.click('div[role="option"]:has-text("Time")');

    // Close popover by clicking outside or pressing escape?
    // Actually the select probably logs it automatically based on my implementation:
    // <Select onValueChange={(val) => handleLogHabit(habit.id, 'completed', val)}>

    // Let's verify it logged by checking if the button turned green (default variant)
    // My implementation: variant={status === 'completed' ? 'default' : 'outline'}
    // default variant usually has a specific class or background.

    // Take a screenshot after interactions
    await page.waitForTimeout(500); // Wait for confetti and state update
    await page.screenshot({ path: 'verification/habits_complete_features.png', fullPage: true });

  } catch (error) {
    console.error('Error:', error);
    await page.screenshot({ path: 'verification/error_state_v2.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();
