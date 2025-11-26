import { test, expect } from '@playwright/test';

test.describe('MatchOS End-to-End Flow', () => {

    const uniqueId = Date.now();
    const userEmail = `e2e_user_${uniqueId}@matchos.com`;
    const password = 'password123';

    test('User can register, create a request, and view matches', async ({ page }) => {
        // 1. Register
        await page.goto('/register');
        await page.fill('input[name="email"]', userEmail);
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', password);

        // Wait for UI to settle
        await page.waitForTimeout(1000);

        await page.click('button[type="submit"]');

        // Wait for redirect to dashboard
        try {
            await page.waitForURL('/dashboard', { timeout: 15000 });
        } catch (e) {
            await page.screenshot({ path: 'failure_dashboard_redirect.png' });
            console.log('Failed to redirect to dashboard. Current URL:', page.url());
            throw e;
        }
        await expect(page.getByText(`Welcome back, ${userEmail}`)).toBeVisible();

        // 2. Create Request
        await page.click('text=Create Request');
        await expect(page).toHaveURL('/requests/new');

        await page.fill('input[placeholder="e.g. Need a Plumber"]', `E2E Test Request ${uniqueId}`);
        await page.click('button:has-text("Next")');

        await page.fill('textarea[placeholder="Describe your request..."]', 'Looking for a Python expert for AI project.');
        await page.click('button:has-text("Next")');

        await page.fill('input[placeholder="e.g. New York, NY"]', 'Remote');
        await page.click('button:has-text("Next")');

        await page.fill('input[placeholder="e.g. 500"]', '1000');
        await page.click('button:has-text("Submit Request")');

        // Wait for redirect to dashboard
        await expect(page).toHaveURL('/dashboard');
        await expect(page.getByText(`E2E Test Request ${uniqueId}`)).toBeVisible();

        // 3. Find Matches
        await page.click(`text=Find Matches 🔍`);

        // Wait for matches page
        await expect(page).toHaveURL(/\/requests\/.*\/matches/);

        // Verify Matches Page content
        await expect(page.getByText('Potential Matches')).toBeVisible();

        // Verify AI Provider is present (assuming register_provider.js was run previously)
        // We check for the provider we created earlier: ai_provider@matchos.com
        // Note: This depends on the provider existing in the DB.
        await expect(page.getByText('ai_provider@matchos.com')).toBeVisible();

        // Verify Score Badge is present
        await expect(page.locator('.bg-primary.text-primary-foreground').first()).toBeVisible();
        await expect(page.getByText('% Match')).toBeVisible();
    });
});
