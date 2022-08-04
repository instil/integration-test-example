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
