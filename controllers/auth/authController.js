import { User } from '../../models/user.js';
export default class authController {
    static register(req, res) {
        return res.render('register');
    }
    static postRegister(req, res) {
        const { firstName, lastName, email, phone, password, cpassword } =
            req.body;
        console.log(firstName, lastName, email, phone, cpassword);
        return res.send('Success');
    }
}
