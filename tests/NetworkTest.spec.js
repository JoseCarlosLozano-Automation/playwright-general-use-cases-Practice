const {test, expect, request} = require('@playwright/test');
import {APIUtils} from '../utils/APIUtils';

const loginPayload = {userEmail: "testacc2@testemail.com", userPassword: "Echo123$"};
const orderPayload = {orders: [{country: "Mexico", productOrderedId: "6960eac0c941646b7a8b3e68"}]};
const fakePayLoadsOrders = {data:[], message:"No Orders"};

let response = {};

test.beforeAll( async () => {
    //Login API
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
});

test('Client API test - Sign in > Validate order', async ({ page }) => {

    page.addInitScript(token => {
        window.localStorage.setItem('token', token);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client/");

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*", async route => {
        const response = await page.request.fetch(route.request());
        let body = JSON.stringify(fakePayLoadsOrders);
        route.fulfill(
            {
                response,
                body
            }
        );
    });

    const ordersButton = page.getByRole('button', { name: '   ORDERS' });

    const [ordersResponse] = await Promise.all([
        page.waitForResponse(res =>
            res.url().includes('/get-orders-for-customer') &&
            res.status() === 200
        ),
        ordersButton.click()
    ]);

    expect(ordersResponse.ok()).toBeTruthy();

    console.log(await page.locator('.mt-4').textContent());

});