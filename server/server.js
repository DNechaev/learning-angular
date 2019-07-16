const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");
const auth = require("./middlewares/auth");
const session = require("./app/services/session");
const cors = require('cors');

const app = express();
session(app, db);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("./public"));
app.use(auth(app, db));

require("./app/api/session")(app, db);
require("./app/api/users")(app, db);
require("./app/api/roles")(app, db);
require("./app/api/events")(app, db);
require("./app/api/purchases")(app, db);

db.sequelize.sync().then(() => {
    app.listen(8080, () => console.log("App listening on external docker app port (see: docker-compose.yml)!"));
});
