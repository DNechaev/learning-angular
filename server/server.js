const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");

const app = express();
app.use(bodyParser.json());
app.use(express.static("./public"));

require("./app/api/users")(app, db);

db.sequelize.sync().then(() => {
    app.listen(8080, () => console.log("App listening on external docker app port (see: docker-compose.yml)!"));
});
