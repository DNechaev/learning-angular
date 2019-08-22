import Router from 'koa-router';
import usersRoutes from './users.routes';
import eventsRoutes from './events.routes';
import purchasesRoutes from './purchases.routes';
import sessionRoutes from './session.routes';

export default () => {
    const router = new Router();

    router.use('/api/session', sessionRoutes());
    router.use('/api', usersRoutes());
    router.use('/api', eventsRoutes());
    router.use('/api', purchasesRoutes());

    return router.routes();
}
