import Router from 'koa-router';
import usersRoutes from './users.routes';
import sessionRoutes from './session.routes';

export default () => {
    const router = new Router();

    router.use('/api/session', sessionRoutes());
    router.use('/api', usersRoutes());

    return router.routes();
}
