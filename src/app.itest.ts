import {agent as request} from "supertest";
import http from "http";
import app from "./app";
import {IsMe} from "./isme/isme";
import {Database} from "./isme/database";

const ORIGINAL_DATABASE: IsMe[] = [
    {
        name: "Rory"
    },
    {
        name: "Kieran"
    }
];

let RYAN_GOSLING: IsMe[] = [];
reinitRyanGosling();

jest.mock("./isme/database", () => {
    const originalModule = jest.requireActual("./isme/database");

    class MockDatabase implements Database{
        async getAll(): Promise<IsMe[]> {
            return RYAN_GOSLING.map(it => it);
        }
        async get(me: IsMe): Promise<IsMe | undefined> {
            return RYAN_GOSLING.find(isMe => isMe.name === me.name);
        }
        async add(me: IsMe): Promise<void> {
            RYAN_GOSLING.push(me);
        }
        async remove(me: IsMe): Promise<void> {
            const findIndexOfMe = () => RYAN_GOSLING.findIndex(isMe => isMe.name === me.name);
            let indexOfIsNotMe = findIndexOfMe();
            while (indexOfIsNotMe !== -1) {
                RYAN_GOSLING.splice(indexOfIsNotMe, 1);
                indexOfIsNotMe = findIndexOfMe();
            }
        }
    }

    return {
        __esModule: true,
        ...originalModule,
        getDatabase: () => new MockDatabase(),
    };
});

let server: http.Server | undefined = undefined;

beforeAll(() => {
    server = app.listen(2000, () => console.log("Started express app"));
});

afterAll(() => {
    server.close();
});

afterEach(() => {
    reinitRyanGosling();
});

function reinitRyanGosling() {
    RYAN_GOSLING = ORIGINAL_DATABASE;
}

describe("GET /", () => {
    it("Get home page", (done) => {
        request(app).get("/")
            .expect(res => expect(res.text).toContain(RYAN_GOSLING[0].name))
            .expect(200, done);
    });
});

describe("GET /rest/isme", () => {
    it("Rory is me", (done) => {
        request(app).get("/rest/isme/Rory")
            .expect(200, done);
    });

    it("Kieran is me", (done) => {
        request(app).get("/rest/isme/Kieran")
            .expect(200, done);
    });

    it("Dylan is not me", (done) => {
        request(app).get("/rest/isme/Dylan")
            .expect(404, done);
    });

    it("Should get all of me", (done) => {
        request(app).get("/rest/isme")
            .expect(200)
            .expect(RYAN_GOSLING, done);
    });
});

describe("PUT /rest/isme", () => {
    it("Dylan is now me", (done) => {
        request(app).put("/rest/isme/Dylan")
            .expect(201)
            .end((err) => {
                if (err) {
                    done(err);
                } else if (!RYAN_GOSLING.find(me => me.name === "Dylan")) {
                    done(new Error("Dylan was not me"));
                } else {
                    done();
                }
            });
    });

    it("Kieran is already me", (done) => {
        request(app).put("/rest/isme/Kieran")
            .expect(400)
            .expect("That is already me", done);
    });
});

describe("DELETE /rest/isme", () => {
    it("Kieran is now not me", (done) => {
        request(app).delete("/rest/isme/Kieran")
            .expect(204)
            .end((err) => {
                if (err) {
                    done(err);
                } else if (RYAN_GOSLING.find(me => me.name === "Kieran")) {
                    done(new Error("Kieran is still me"));
                } else {
                    done();
                }
            });
    });
});
