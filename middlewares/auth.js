import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config();
const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.mySecret);
        const user = await User.findOne({ _id: verifyUser });
        (req.token = token), (req.user = user);
        next();

        // next();
    } catch (error) {
        res.status(401).redirect('/login');
    }
};
export default auth;
