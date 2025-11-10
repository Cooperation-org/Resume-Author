/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test';

test.describe('FAQ accordion interactions', () => {
  test('navigates to FAQ page and toggles the first accordion', async ({ page }) => {
    const faqQuestion = '🚀 How to Get Started with Resume Author - Complete Guide';

    await page.goto('/');

    await page.getByRole('button', { name: 'Help & FAQ' }).click();

    await expect(page).toHaveURL(/\/faq$/);
    await expect(page.getByRole('heading', { name: 'Resume Author User Guide' })).toBeVisible();

    const accordionToggle = page.getByRole('button', { name: faqQuestion });
    const accordionPanel = page.getByRole('region', { name: faqQuestion });

    await expect(accordionPanel).toBeVisible();

    await accordionToggle.click();
    await expect(accordionPanel).toBeHidden();

    await accordionToggle.click();
    await expect(accordionPanel).toBeVisible();
  });
});

