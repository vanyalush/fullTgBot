const UserService = require("../services/userService")
const {validationResult } = require("express-validator");
const ApiError = require("../exceptions/ApiError");

class userController {
    async registration(req, res, next) {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации ', errors.array()));
            }
            const {email, password} = req.body;
            const userData = await UserService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true,
                sameSite: 'none',});
            return res.json(userData);
        }catch(e){
            next(e);
        }
    }
    async login(req, res, next) {
        try{
            const {email, password} = req.body;
            const userData = await UserService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken,
                {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        }catch(e){
            next(e);
        }
    }
    async logout(req, res, next) {
        try{
            const {refreshToken} = req.cookies;
            const token = await UserService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        }catch(e){
            next(e);
        }
    }
    async activate(req, res, next) {
        try{
            const activationLink = req.params.link;
            await UserService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        }catch(e){
            next(e);
        }
    }
    async refresh(req, res, next) {
        try{
            const {refreshToken} = req.cookies;
            const userData = await UserService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        }catch(e){
            next(e);
        }
    }
    async getUsers(req, res, next) {
        try{
            const users = await UserService.getAllUsers()
            return res.json(users)
        }catch(e){
            next(e);
        }
    }
}

module.exports = new userController();