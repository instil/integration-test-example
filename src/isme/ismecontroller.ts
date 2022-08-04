import {Request, Response} from "express";
import {allOfMe, isMe, isNotMe, thatIsMe} from "./service";
import {IsMe} from "./isme";

export async function handleHomePage(req: Request, res: Response): Promise<void> {
    return allOfMe()
        .then(results =>
            res.render("home", { folks_who_are_me: results })
        );
}

export async function handleThatIsMe(req: Request, res: Response): Promise<void> {
    const me = constructIsMe(req);

    return thatIsMe(me)
        .then(isThatMe => {
            if (isThatMe) {
                res.status(200);
            } else {
                res.status(404);
            }
        })
        .catch(err => {
            res.status(500);
            res.send(err);
        });
}

export async function handleIsMe(req: Request, res: Response): Promise<void> {
    const me = constructIsMe(req);

    return thatIsMe(me)
        .then(isThatMe => {
            if (isThatMe) {
                res.status(400);
                res.send("That is already me");
            } else {
                isMe(me);
                res.status(201);
            }
        });
}

export async function handleIsNotMe(req: Request, res: Response): Promise<void> {
    const me = constructIsMe(req);

    return isNotMe(me)
        .then(() => {
            res.status(204);
        });
}

export async function handleGetAllOfMe(req: Request, res: Response): Promise<void> {
    return allOfMe()
        .then(results => {
            res.status(200);
            res.setHeader("Content-Type", "application/json");
            res.json(results);
        });
}

function constructIsMe(req: Request): IsMe {
    const name = req.params.name;
    return {
        name
    };
}