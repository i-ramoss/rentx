import express from 'express';
import swaggerUi from 'swagger-ui-express';

import './database';

import { router } from './routes';
import swaggerFile from './swagger.json';

const PORT = 3333;

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.listen(PORT, () => console.log(`🔥️ Server is running at port ${PORT}`));
