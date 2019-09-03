import Koa from 'koa';
import routes from './routes';
import db from './models';

const app = module.exports = new Koa();

app.context.db = db;

routes(app);

db.sequelize.sync()
    .then(() => {
        app.listen(8080);
    });

