import { Express, Request, Response } from "express";
export default function Api(app: Express) {
    app.get('/', (req: Request, res: Response) => {
        res.json({
            ping: "pong"
        });
    })
}