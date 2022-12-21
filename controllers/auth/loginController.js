import { User } from '../../models/user.js';
import bcrypt from 'bcryptjs';
export default class loginController {
    static login(req, res) {
        return res.render('login');
    }
    static async postLogin(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.redirect('/login');
            }
            const emailExists = await User.findOne({ email });
            const checkPass = await bcrypt.compare(
                password,
                emailExists.password
            );
            if (emailExists && checkPass) {
                return res.render('home');
            }
            return res.send('Invalid Credentials');
        } catch (error) {
            console.log(error);
            return res.send('Invalid Credentials');
        }
    }
}
