import Router from 'koa-router';

import Role from '../../shared/roles.enum';
import accessMiddleware from '../../middlewares/access.middleware';
import eventsController from '../../controllers/events.controller';
import purchasesController from "../../controllers/purchases.controller";

export default () => {
    const router = new Router();

    router
        .get('/events', accessMiddleware([Role.MANAGER, Role.USER] ), eventsController.getAll )
        .get('/events/:id', accessMiddleware([Role.MANAGER, Role.USER] ), eventsController.getById )
        .post('/events', accessMiddleware([Role.MANAGER] ), eventsController.create )
        .put('/events/:id', accessMiddleware([Role.MANAGER] ), eventsController.update )
        .delete('/events/:id', accessMiddleware([Role.MANAGER] ), eventsController.delete )
        .post('/events/:id/buy', accessMiddleware([Role.USER] ), purchasesController.buy );

    return router.routes();
}
