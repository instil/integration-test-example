import {test, expect, Page} from "@playwright/test";
import http from "http";
import app from "../src/app";
import {getDatabase} from "../src/isme/database";

const USER_1 = {
    name: "user1"
};
const USER_2 = {
    name: "user2"
};
const database = getDatabase();

async function tearDownDatabase() {
    await remove();
}

let server: http.Server | undefined = undefined;

test.beforeAll(() => {
    server = app.listen(1000, () => console.log("Started express app"));
});

test.afterAll(() => {
    server.close();
});

test.beforeEach(tearDownDatabase);

test("Correct Title", async ({ page }) => {
    await goToHome(page);
    await expectTitleToBeCorrect(page);
});

test("Correct Headline Header", async ({ page }) => {
    await goToHome(page);
    await expectHeadlineHeaderToBeCorrect(page);
});

test("Add User", async ({ page }) => {
    await goToHome(page);
    const name = USER_1.name;

    await addUser(page, name);

    await expectNameToBeVisible(page, name);
});

test("Add multiple Users", async ({ page }) => {
    await goToHome(page);
    const name1 = USER_1.name;
    const name2 = USER_2.name;

    await addUser(page, name1);
    await addUser(page, name2);

    await expectNameToBeVisible(page, name1);
    await expectNameToBeVisible(page, name2);
});

test("Remove user", async ({ page }) => {
    await goToHome(page);
    const name = USER_1.name;

    await addUser(page, name);
    await removeUser(page, name);

    await expectNameToNotBePresent(page, name);
});

async function goToHome(page: Page) {
    await page.goto("http://localhost:1000/");
}

async function expectTitleToBeCorrect(page: Page) {
    await expect(page).toHaveTitle("Is Me");
}

async function expectHeadlineHeaderToBeCorrect(page: Page) {
    const header = page.locator("text=Folks who are Ryan Gosling");
    await expect(header).toBeVisible();
}

async function addUser(page: Page, name: string) {
    await inputName(page, name);
    await submitName(page);
}

async function inputName(page: Page, name: string) {
    const thisIsMeInput = page.locator("id=this-is-me-name");
    await thisIsMeInput.fill(name);
}

async function submitName(page: Page) {
    const thisIsMeButton = page.locator("id=this-is-me-button");
    await thisIsMeButton.click();
}

async function removeUser(page: Page, name: string) {
    const thisIsMeButton = page.locator(`id=remove-me-${name}`);
    await thisIsMeButton.click();
}

async function expectNameToBeVisible(page: Page, name: string) {
    await expect(page.locator(`id=name-${name}`)).toBeVisible({ timeout: 10000 });
}

async function expectNameToNotBePresent(page: Page, name: string) {
    await expect(page.locator(`id=name-${name}`)).toHaveCount(0, { timeout: 10000 });
}

async function remove() {
    await database.remove(USER_1);
    await database.remove(USER_2);
}