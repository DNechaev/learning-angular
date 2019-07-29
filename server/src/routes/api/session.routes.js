const Router = require('koa-router');
const Role = require('../../shared/roles.enum');
const accessMiddleware = require('../../middlewares/access.middleware');
const sessionController = require('../../controllers/session.controller');

module.exports = () => {
    const router = new Router();

    router
        .get('/profile', accessMiddleware([], true ), sessionController.profile )
        .post('/login', accessMiddleware([], true, true ), sessionController.login )
        .post('/logout', accessMiddleware([], true ), sessionController.logout )
        .post('/registration', accessMiddleware([], false, true ), sessionController.registration );

    return router.routes();
};
