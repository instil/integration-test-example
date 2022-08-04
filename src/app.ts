import express, {Request, Response} from "express";
import favicon from "serve-favicon";
import {handleGetAllOfMe, handleHomePage, handleIsMe, handleIsNotMe, handleThatIsMe} from "./isme/ismecontroller";
import path from "path";
import errorHandler from "errorhandler";

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public/images", "favicon.ico")));
app.use(errorHandler());

const handle = (handler: (req: Request, res: Response) => Promise<void>) => async (req: Request, res: Response): Promise<void> => {
    await handler(req, res)
        .finally(() => {
            if (!res.headersSent) {
                res.send();
            }
        });
};

// View controllers
app.get("/", handleHomePage);

// Rest controllers
app.get("/rest/isme/:name", handle(handleThatIsMe));
app.put("/rest/isme/:name", handle(handleIsMe));
app.delete("/rest/isme/:name", handle(handleIsNotMe));
app.get("/rest/isme", handle(handleGetAllOfMe));

export default app;
