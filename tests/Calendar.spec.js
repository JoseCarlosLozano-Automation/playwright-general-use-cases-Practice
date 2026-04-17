const {test, expect} = require('@playwright/test');

test('Calendar validations', async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");

    const monthValue = "7";
    const dayValue = "24";
    const yearValue = "2026";
    const expectedList = [monthValue, dayValue, yearValue];

    await page.locator(".react-date-picker__inputGroup input.react-date-picker__inputGroup__month").fill(monthValue);
    await page.locator(".react-date-picker__inputGroup input.react-date-picker__inputGroup__day").fill(dayValue);
    await page.locator(".react-date-picker__inputGroup input.react-date-picker__inputGroup__year").fill(yearValue);

    const inputs =  page.locator(".react-date-picker__inputGroup__input");

    for(let i=0; i<expectedList.length; i++){
        const value = await inputs.nth(i).inputValue();
        expect(value).toEqual(expectedList[i]);
    }

});