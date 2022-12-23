import { User } from '../models/user.js';
export default class homeController {
    static async index(req, res) {
        const data = await User.find();
        const loggedIn = req.cookies.jwt;
        res.render('home', { data });
    }
}
