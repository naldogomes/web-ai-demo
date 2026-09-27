import { expect, test } from '@playwright/test';
import { installChromeAIMock, mockedAnswer } from './support/chromeAiMock';

test.beforeEach(async ({ page }) => {
    await page.addInitScript(installChromeAIMock);
    await page.goto('/');
});

test('starts a chat, gets an answer and deletes the chat', async ({ page }) => {
    const question = 'What is the capital of France?';
    const chats = page.getByRole('navigation', { name: 'Chats' });

    await expect(chats.getByText('Your chats will appear here.')).toBeVisible();

    // Start a new chat and ask a question
    await page.getByRole('button', { name: 'New chat' }).click();
    await expect(page.getByRole('heading', { name: 'How can I help?' })).toBeVisible();

    const input = page.getByRole('textbox', { name: 'Your message' });
    await input.fill(question);
    await input.press('Enter');

    // The question and the streamed answer show up, and the chat is listed by its title
    const main = page.getByRole('main');
    await expect(main.getByText(question, { exact: true })).toBeVisible();
    await expect(main.getByText(mockedAnswer(question))).toBeVisible();
    await expect(input).toBeEmpty();
    await expect(chats.getByRole('button', { name: question, exact: true })).toBeVisible();

    // Delete the chat, accepting the confirmation
    page.once('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toBe(`Delete the chat "${question}"? This cannot be undone.`);
        await dialog.accept();
    });
    await chats.getByRole('button', { name: `Delete chat: ${question}` }).click();

    await expect(chats.getByText('Your chats will appear here.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'How can I help?' })).toBeVisible();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('webai.conversations'))).toBe('[]');
});
