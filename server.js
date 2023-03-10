import express from 'express';
import dotenv from 'dotenv';
import { dbConnection } from './db/conn.js';
import { router } from './routes/web.js';
import expressLayouts from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import session from 'express-session';
import flash from 'express-flash';
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
app.use(
    session({
        secret: process.env.cookie_Secret,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
    })
);
app.use(flash());
app.use(fileUpload({ useTempFiles: true }));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    let user = req.cookies.jwt;
    res.locals.user = user;
    next();
});

app.use(router);

app.listen(PORT, () => {
    try {
        dbConnection(process.env.MONGODB_URL);
        console.log(`Server at port ${PORT}`);
    } catch (error) {
        console.log(error);
    }
});
