import { User } from '../../models/user.js';
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
                const registerUser = new User({
                    firstName,
                    lastName,
                    email,
                    phone,
                    password,
                    cpassword,
                });
                await registerUser.save();
                return res.redirect('/');
            }
        } catch (error) {
            res.redirect('/register');
            console.log(error);
        }
    }
}
