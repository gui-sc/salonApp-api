import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter';
import professionalRouter from './routes/professionalRouter';
import serviceRouter from './routes/serviceRouter';
import professionalServiceRouter from './routes/professionalServiceRouter';
import reviewRouter from './routes/reviewRouter';
import morgan from 'morgan';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(express.json());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/professional", professionalRouter);
app.use("/service", serviceRouter);
app.use("/professionalService", professionalServiceRouter);
app.use("/review", reviewRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});