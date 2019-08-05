import Router from 'koa-router';

import Role from '../../shared/roles.enum';
import accessMiddleware from '../../middlewares/access.middleware';
import usersController from '../../controllers/users.controller';

export default () => {
    const router = new Router();

    router
        .get('/users', accessMiddleware([Role.ADMIN] ), usersController.getAll )
        .get('/users/:id', accessMiddleware([Role.ADMIN] ),usersController.getById )
        .post('/users', accessMiddleware([Role.ADMIN] ),usersController.create )
        .put('/users/:id', accessMiddleware([Role.ADMIN] ),usersController.update )
        .delete('/users/:id', accessMiddleware([Role.ADMIN] ),usersController.delete );

    return router.routes();
}
