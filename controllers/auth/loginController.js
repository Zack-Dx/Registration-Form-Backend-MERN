import { User } from '../../models/user.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
export default class loginController {
    static login(req, res) {
        return res.render('login');
    }
    static async postLogin(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                req.flash('error', 'All fields are required.');
                return res.redirect('/login');
            }
            const emailExists = await User.findOne({ email });
            const checkPass = await bcrypt.compare(
                password,
                emailExists.password
            );
            if (emailExists && checkPass) {
                // TOKEN
                const token = jwt.sign(
                    emailExists._id.toString(),
                    process.env.mySecret
                );
                res.cookie('jwt', token, {
                    expires: new Date(Date.now() + 500000),
                    httpOnly: true,
                    // secure: true, (only for https)
                });
                return res.redirect('/');
            }
            req.flash('error', 'Invalid Credentials');
            return res.redirect('/login');
        } catch (error) {
            console.log(error);
            return res.send('Invalid Credentials');
        }
    }
    static async logout(req, res) {
        try {
            res.clearCookie('jwt');
            req.user.tokens = [];
            await req.user.save();
            res.redirect('/login');
        } catch (error) {
            console.log(error);
            res.status(500).send('error');
        }
    }
}
