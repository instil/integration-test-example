import {test, expect} from "@playwright/test";
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
    await page.goto("http://localhost:1000/");
    await expect(page).toHaveTitle("Is Me");
});

async function remove() {
    await database.remove(USER_1);
    await database.remove(USER_2);
}