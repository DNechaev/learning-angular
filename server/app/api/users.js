module.exports = (app, db) => {
    app.get( "/api/users", (req, res) =>
        db.user.findAll().then( (result) => res.json(result) )
    );

    app.get( "/api/users/:id", (req, res) =>
        db.user.findByPk(req.params.id).then( (result) => res.json(result))
    );

    app.post("/api/users", (req, res) =>
        db.user.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }).then( (result) => res.json(result) )
    );

    app.put( "/api/users/:id", (req, res) =>
        db.user.update({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            },
            {
                where: {
                    id: req.params.id
                }
            }).then( (result) => res.json(result) )
    );

    app.delete( "/api/users/:id", (req, res) =>
        db.user.destroy({
            where: {
                id: req.params.id
            }
        }).then( (result) => res.json(result) )
    );
}
