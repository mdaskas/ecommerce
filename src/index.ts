import express, {type Express} from 'express';
import rootRouter from './routes';
import { PORT } from './secrets';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middleware/errors';

const app : Express = express();

app.use(express.json());

app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
	log: ['query'],
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
