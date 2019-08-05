import Router from 'koa-router';

import accessMiddleware from '../../middlewares/access.middleware';
import sessionController from '../../controllers/session.controller';
// import Role from '../../shared/roles.enum';

export default () => {
    const router = new Router();

    router
        .get('/profile', accessMiddleware([], true ), sessionController.profile )
        .post('/login', accessMiddleware([], true, true ), sessionController.login )
        .post('/logout', accessMiddleware([], true ), sessionController.logout )
        .post('/registration', accessMiddleware([], false, true ), sessionController.registration );

    return router.routes();
}
