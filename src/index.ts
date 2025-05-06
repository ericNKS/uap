import express, { Request, Response } from 'express';
import Api from './routes/Api';
const app = express();

const PORT = 3000;

app.use(express.json())
// Route
Api(app)

app.listen(PORT, async(err) => {
    err ? console.error(err) : '';
})