/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test';

test.describe('Resume Import Page (/resume/import)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/resume/import');
  });

  test('loads the resume import page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/resume\/import/);
  });

  test('displays the required elements', async ({ page }) => {
    // "Start from scratch" and "Upload Resume" are headings (Typography variant='h6')
    await expect(page.getByRole('heading', { name: 'Start from scratch' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Upload Resume' })).toBeVisible();
    
    // "Go to My Resumes" is a button, not a heading
    await expect(page.getByRole('button', { name: 'Go to My Resumes' })).toBeVisible();
  });

  // responsive design
  test('is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForTimeout(1000);
    
    // "Start from scratch" and "Upload Resume" should be visible
    await expect(page.getByRole('heading', { name: 'Start from scratch' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Upload Resume' })).toBeVisible();
  });
});