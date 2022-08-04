import {getDatabase} from "./database";
import {IsMe} from "./isme";
import {MongoError} from "mongodb";

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
        await expectIsMeRecordsToBe([]);
    });
});

describe("Add", () => {
    it("Add me", async () => {
        await add().then(result =>
            expect(result).toStrictEqual(ME)
        );
        await expectIsMeRecordsToBe([ME]);
    });

    it("Duplicate Add me", async () => {
        await add();
        await add().catch(err => {
            expect(err).toBeInstanceOf(MongoError);
        });
    });
});

describe("Remove", () => {
    it("Remove non-existing record", async () => {
        await remove();
    });

    it("Remove existing record", async () => {
        await add();
        await remove();
        await expectIsMeRecordsToBe([]);
    });
});

describe("Get", () => {
    it("Get non-existing record", async () => {
        await get().then(result =>
            expect(result).toBeUndefined()
        );
    });

    it("Get existing record", async () => {
        await add();
        await get().then(result =>
            expect(result).toStrictEqual(ME)
        );
    });
});

async function expectIsMeRecordsToBe(isMeRecords: IsMe[]) {
    const allOfMe = await database.getAll();
    expect(allOfMe).toStrictEqual(isMeRecords);
}

async function add(): Promise<IsMe> {
    return database.add(ME)
        .then(() => ME);
}

async function remove() {
    await database.remove(ME);
}

async function get(): Promise<IsMe> {
    return database.get(ME);
}