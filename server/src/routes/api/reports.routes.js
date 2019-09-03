import Router from 'koa-router';

import Role from '../../shared/roles.enum';
import accessMiddleware from '../../middlewares/access.middleware';
import ReportsController from "../../controllers/reports.controller";

export default () => {
    const router = new Router();

    router
        .get('/reports', accessMiddleware([Role.ADMIN, Role.MANAGER, Role.USER] ), ReportsController.getReport );

    return router.routes();
}
