
import { test, expect } from '@playwright/test';

test.describe('JWT.io automation tests', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhIjoxLCJiIjoyLCJjIjozLCJpYXQiOjE2OTYzOTc5Mjd9.6S9s1qxsu454fCUtOOME3Y_LLw7jq1owBleccDmPwvo';
  const secret = 'helloworld';

  test('Scenario 1: Paste token and assert value of c is 3 and Invalid Signature appears', async ({ page }) => {
    await page.goto('https://jwt.io');

    const encodedInput = page.locator('#jwtInput');
    await encodedInput.fill(token);

    const decodedText = await page.locator('text="c": 3').isVisible();
    expect(decodedText).toBeTruthy();

    const invalidSig = await page.locator('text="Invalid Signature"').isVisible();
    expect(invalidSig).toBeTruthy();
  });

  test('Scenario 2: Verify signature with secret and test changes', async ({ page }) => {
    await page.goto('https://jwt.io');

    const encodedInput = page.locator('#jwtInput');
    await encodedInput.fill(token);

    const secretInput = page.locator('#secret');
    await secretInput.fill(secret);

    const validSig = await page.locator('text="Signature Verified"').isVisible();
    expect(validSig).toBeTruthy();

    const decodedText = await page.locator('text="c": 3').isVisible();
    expect(decodedText).toBeTruthy();

    await secretInput.fill('wrongsecret');
    const stillSamePayload = await page.locator('text="c": 3').isVisible();
    expect(stillSamePayload).toBeTruthy();

    const newInvalidSig = await page.locator('text="Invalid Signature"').isVisible();
    expect(newInvalidSig).toBeTruthy();
  });
});
