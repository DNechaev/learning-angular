const Router = require('koa-router');
const usersRoutes = require('./users.routes');
const sessionRoutes = require('./session.routes');

module.exports = () => {
    const router = new Router();

    router.use('/api/session', sessionRoutes());
    router.use('/api', usersRoutes());

    return router.routes();
};
