import { Express, Request, Response } from "express";
export default function Api(app: Express) {
    app.get('/api', (req: Request, res: Response) => {
        res.json({
            ping: "pong"
        });
    })

    app.use((req: Request, res: Response) => {
        res.status(404).json({
            message: 'Ohh you are lost, read the API documentation to find your way back home :)'
        })
    })
}