import {getDatabase} from "./database";

const ME = {
    name: "me"
};
const database = getDatabase();

async function tearDownDatabase() {
    await remove();
}

beforeEach(tearDownDatabase);

describe("Get All", () => {
    it("Empty List", async () => {
        const allOfMe = await database.getAll();
        expect(allOfMe).toStrictEqual([]);
    });
});

async function remove() {
    await database.remove(ME);
}