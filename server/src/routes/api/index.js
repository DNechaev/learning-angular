import Router from 'koa-router';
import usersRoutes from './users.routes';
import eventsRoutes from './events.routes';
import sessionRoutes from './session.routes';

export default () => {
    const router = new Router();

    router.use('/api/session', sessionRoutes());
    router.use('/api', usersRoutes());
    router.use('/api', eventsRoutes());

    return router.routes();
}
