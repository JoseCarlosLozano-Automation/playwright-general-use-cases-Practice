const {test, expect} = require('@playwright/test');

test('Browser Context-Validation Login Error test', async ({ browser }) => {

    //Following lines are required when we want to add specific parameters for the new created page for the automated test, like -> .newContext(cookies...)
    const context = await browser.newContext();
    const page = await context.newPage();

    //Defining the selectors as variables to be more clear
    const userName = page.locator("#username");
    const userPass = page.locator("#password");
    const signInBtn = page.locator("#signInBtn");
    const cardTitles = page.locator(".card-body a");

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await userName.fill("rahulshettyacademy");
    await userPass.fill("wrongpass");
    await signInBtn.click();
    //console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText("Incorrect");

    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await userPass.fill("Learning@830$3mK2");
    await signInBtn.click();
    
    console.log(await cardTitles.first().textContent()); // Picks the first of the selected elements
    console.log(await cardTitles.nth(1).textContent()); // Picks the specific element of the selected ones

    const allTitles = await cardTitles.allTextContents(); // Picks all the titles of the selected elements - BEWARE: THIS METHOD DOESN'T WAIT FOR THE ELEMENTS TO BE IN THE DOM, so it could return an empty array without failing the test
    console.log(allTitles);

});

test('UI Controls', async ({ page }) => {
    
    const userName = page.locator("#username");
    const userPass = page.locator("#password");
    const dropdown = page.locator("select.form-control");
    const radioUser = page.locator(".radiotextsty").last();
    const popUpAccept = page.locator("#okayBtn");
    const termsCond = page.locator("#terms");
    const signInBtn = page.locator("#signInBtn");
    const documentLink = page.locator("[href*='documents-request']");

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    await userName.fill("rahulshettyacademy");
    await userPass.fill("Learning@830$3mK2");
    await radioUser.click();
    await expect(popUpAccept).toBeVisible();
    await popUpAccept.click();
    await expect(radioUser).toBeChecked();
    expect(await termsCond.isChecked()).toBeFalsy();
    await termsCond.click();
    await expect(termsCond).toBeChecked();
    await dropdown.selectOption("consult");
    await expect(documentLink).toHaveAttribute("class","blinkingText");
    await signInBtn.click();
});


test('Child windows handling', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    const userName = page.locator("#username");
    const userPass = page.locator("#password");
    const documentLink = page.locator("[href*='documents-request']");

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
   
    const [newPage] = await Promise.all(
        [   context.waitForEvent('page'),
            await documentLink.click()
        ]
    )

    const text = await newPage.locator("p.red").textContent();
    const match = text.match(/@([^\.]+)/);
    const domain = match ? match[1] : null;

    await userName.fill(domain);
    await userPass.fill("Learning@830$3mK2");

    console.log("The input value is: " + await userName.inputValue());
});

test('test', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Free Access to InterviewQues/' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('link', { name: 'JOIN NOW' }).click();
  await page1.getByTestId('name-input').click();
  await page1.getByTestId('name-input').fill('test@test.com');
  await page1.getByTestId('email-input').click();
  await page1.getByTestId('email-input').fill('tester');
  await page1.getByTestId('allow-marketing-emails').check();
  await page1.getByRole('link', { name: 'Log in' }).click();
  await expect(page1.getByRole('banner')).toMatchAriaSnapshot(`
    - link "Rahul Shetty Academy":
      - /url: https://courses.rahulshettyacademy.com
      - img "Rahul Shetty Academy"
    `);
  await page1.getByRole('link', { name: 'Rahul Shetty Academy' }).click();
  await expect(page1.getByRole('link', { name: 'Rahul Shetty Academy' })).toBeVisible();
  await expect(page1.locator('#block-207174307')).toContainText('View All Products');
});