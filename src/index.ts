import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter';
import professionalRouter from './routes/professionalRouter';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger_output.json';
const app = express();

app.use(cors());

app.use(express.json());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/professional", professionalRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});