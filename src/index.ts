import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { ApiControllers } from './routes/Api';


const app = createExpressServer({
    controllers: ApiControllers,
});

const PORT = 3000;



app.listen(PORT, () => {
    console.log("Server running on port 3000");
})