import Router from 'koa-router';

import Role from '../../shared/roles.enum';
import accessMiddleware from '../../middlewares/access.middleware';
import eventsController from '../../controllers/events.controller';

export default () => {
    const router = new Router();

    router
        .get('/events', accessMiddleware([Role.MANAGER] ), eventsController.getAll )
        .get('/events/:id', accessMiddleware([Role.MANAGER] ),eventsController.getById )
        .post('/events', accessMiddleware([Role.MANAGER] ),eventsController.create )
        .put('/events/:id', accessMiddleware([Role.MANAGER] ),eventsController.update )
        .delete('/events/:id', accessMiddleware([Role.MANAGER] ),eventsController.delete );

    return router.routes();
}
