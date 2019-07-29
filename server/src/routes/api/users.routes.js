const Router = require('koa-router');
const Role = require('../../shared/roles.enum');
const accessMiddleware = require('../../middlewares/access.middleware');
const usersController = require('../../controllers/users.controller');

module.exports = () => {
    const router = new Router();

    router
        .get('/users', accessMiddleware([Role.ADMIN] ), usersController.getAll )
        .get('/users/:id', accessMiddleware([Role.ADMIN] ),usersController.getById )
        .post('/users', accessMiddleware([Role.ADMIN] ),usersController.create )
        .put('/users/:id', accessMiddleware([Role.ADMIN] ),usersController.update )
        .delete('/users/:id', accessMiddleware([Role.ADMIN] ),usersController.delete );

    return router.routes();
};
