import { User } from '../../models/user.js';
import dotenv from 'dotenv';
dotenv.config();
import cloudinary from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_API_key,
    api_secret: process.env.Cloud_API_secret,
    // secure: true,
});
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export default class authController {
    static async register(req, res) {
        return res.render('register');
    }
    static async postRegister(req, res) {
        try {
            const {
                firstName,
                lastName,
                email,
                phone,
                avatar,
                password,
                cpassword,
            } = req.body;
            const userExists = await User.exists({ email });
            if (
                !firstName ||
                !lastName ||
                !email ||
                !phone ||
                !avatar ||
                !password ||
                !cpassword
            ) {
                req.flash('error', 'All fields are required.');
                return res.redirect('/register');
            } else if (password != cpassword) {
                req.flash('error', "Password doesn't match");
                return res.redirect('/register');
            } else if (userExists) {
                req.flash('error', 'Email already exists!');
                return res.redirect('/register');
            } else {
                const file = req.files.avatar;
                const myCloud = await cloudinary.v2.uploader.upload(
                    file.tempFilePath,
                    { folder: 'userImage' }
                );
                const hashedPassword = await bcrypt.hash(password, 10);
                const registerUser = new User({
                    firstName,
                    lastName,
                    email,
                    phone,
                    avatar: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
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
                        expires: new Date(Date.now() + 600000),
                        httpOnly: true,
                    });
                } catch (error) {
                    console.log(error);
                }

                await registerUser.save();
                return res.redirect('/');
            }
        } catch (error) {
            console.log(error);
            res.redirect('/register');
        }
    }
}
