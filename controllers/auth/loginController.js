import { User } from '../../models/user.js';
export default class loginController {
    static login(req, res) {
        return res.render('login');
    }
    static async postLogin(req, res) {
        try {
            const { email, password } = req.body;
            const emailExists = await User.findOne({ email });
            if (emailExists && emailExists.password === password) {
                return res.render('home');
            }
            return res.send('Invalid Credentials');
        } catch (error) {
            console.log(error);
            return res.send('Invalid Credentials');
        }
    }
}
