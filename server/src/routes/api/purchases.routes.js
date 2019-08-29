import Router from 'koa-router';

import Role from '../../shared/roles.enum';
import accessMiddleware from '../../middlewares/access.middleware';
import purchasesController from '../../controllers/purchases.controller';

export default () => {
    const router = new Router();

    router
        .get('/purchases', accessMiddleware([Role.ADMIN, Role.USER] ), purchasesController.getAll )
        .get('/purchases/:id', accessMiddleware([Role.ADMIN, Role.USER] ),purchasesController.getById )
        .post('/purchases', accessMiddleware([Role.ADMIN] ),purchasesController.create )
        .put('/purchases/:id', accessMiddleware([Role.ADMIN] ),purchasesController.update )
        .delete('/purchases/:id', accessMiddleware([Role.ADMIN] ),purchasesController.delete );

    return router.routes();
}
