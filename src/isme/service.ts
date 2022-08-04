import {IsMe} from "./isme";
import {getDatabase} from "./database";

const database = getDatabase();

export async function thatIsMe(me: IsMe): Promise<boolean> {
    return database.get(me).then(isMe => !!isMe);
}

export async function isMe(me: IsMe): Promise<void> {
    return database.add(me);
}

export async function isNotMe(me: IsMe): Promise<void> {
    return database.remove(me);
}

export async function allOfMe(): Promise<IsMe[]> {
    return database.getAll();
}