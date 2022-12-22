import express from 'express';
import dotenv from 'dotenv';
import { dbConnection } from './db/conn.js';
import { router } from './routes/web.js';
import expressLayouts from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
dotenv.config();

const PORT = process.env.PORT;
const app = express();
app.use(expressLayouts);
app.use(express.static('public'));

//View Engine
app.set('view engine', 'ejs');

//Router
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(PORT, () => {
    try {
        dbConnection(process.env.MONGODB_URL);
        console.log(`Server at port ${PORT}`);
    } catch (error) {
        console.log(error);
    }
});
