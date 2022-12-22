import { User } from '../../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export default class authController {
    static register(req, res) {
        return res.render('register');
    }
    static async postRegister(req, res) {
        try {
            const { firstName, lastName, email, phone, password, cpassword } =
                req.body;
            const userExists = await User.exists({ email });

            if (
                !firstName ||
                !lastName ||
                !email ||
                !phone ||
                !password ||
                !cpassword
            ) {
                return res.redirect('/register');
            } else if (password != cpassword) {
                return res.json({
                    message: `Passwords doesn't match`,
                });
            } else if (userExists) {
                return res.json({ message: 'Email already taken.' });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const registerUser = new User({
                    firstName,
                    lastName,
                    email,
                    phone,
                    password: hashedPassword,
                    cpassword: hashedPassword,
                });
                // Generating Token
                try {
                    const token = jwt.sign(
                        registerUser._id.toString(),
                        process.env.mySecret
                    );
                    registerUser.tokens = registerUser.tokens.concat({
                        token,
                    });
                    res.cookie('jwt', token, {
                        expires: new Date(Date.now() + 30000),
                        httpOnly: true,
                    });
                } catch (error) {
                    console.log(error);
                }

                await registerUser.save();
                return res.redirect('/');
            }
        } catch (error) {
            res.redirect('/register');
            console.log(error);
        }
    }
}
