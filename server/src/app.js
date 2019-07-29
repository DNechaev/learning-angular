const Koa = require('koa');
const routes = require("./routes");
const db = require("./models");

const app = module.exports = new Koa();

app.context.db = db;

routes(app);

db.sequelize.sync()
    .then(() => {
        app.listen(8080);
    });

