import dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import bluebird from "bluebird";
import {IsMe} from "./isme";
import logger from "../logger";
import {FilterQuery} from "mongodb";

function setupMongoDb() {
    if (fs.existsSync(".env")) {
        logger.info("Using .env file to supply config environment variables");
        dotenv.config({path: ".env"});
    }
    const MONGODB_URI = process.env["MONGODB_URI"];
    if (!MONGODB_URI) {
        logger.info("No mongo connection string. Set MONGODB_URI environment variable.");
        process.exit(1);
    }

    mongoose.Promise = bluebird;
    mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}).then(
        () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
        },
    ).catch(err => {
        logger.info(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
        process.exit(1);
    });
}

type IsMeDocument = mongoose.Document & {
    name: string;
}

const isMeSchema = new mongoose.Schema<IsMeDocument>(
    {
        name: { type: String, unique: true }
    }
);

export const IsMeModel = mongoose.model<IsMeDocument>("IsMe", isMeSchema);

export interface Database {
    getAll(): Promise<IsMe[]>,
    get(me: IsMe): Promise<IsMe | undefined>,
    add(me: IsMe): Promise<void>,
    remove(me: IsMe): Promise<void>
}

export function getDatabase(): Database {
    setupMongoDb();
    return new MongoDBDatabase();
}

class MongoDBDatabase implements Database {
    async getAll(): Promise<IsMe[]> {
        return IsMeModel.find().exec().then((isMeDocs: IsMeDocument[]) => {
            return isMeDocs.map(MongoDBDatabase.mapToIsMe);
        });
    }

    async get(me: IsMe): Promise<IsMe | undefined> {
        return IsMeModel.findOne(MongoDBDatabase.filterIsMeDocument(me))
            .then(result => {
                if (result) {
                    logger.debug("Got a result!");
                    return MongoDBDatabase.mapToIsMe(result);
                }
                logger.debug("Failed to find a result!");
                return undefined;
            });
    }

    private static mapToIsMe(isMeDoc: IsMeDocument): IsMe {
        const name = isMeDoc.name;
        return {
            name
        };
    }

    async add(me: IsMe): Promise<void> {
        return IsMeModel.create({
            name: me.name
        }).then();
    }

    async remove(me: IsMe): Promise<void> {
        return IsMeModel.deleteMany(MongoDBDatabase.filterIsMeDocument(me)).exec();
    }

    private static filterIsMeDocument(me: IsMe): FilterQuery<IsMeDocument> {
        return {
            name: me.name
        };
    }
}