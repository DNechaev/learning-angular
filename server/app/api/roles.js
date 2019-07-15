module.exports = (app, db) => {
    app.get( "/api/roles", (req, res) => {

        // Access
        if (req.auth.guest) {
            return res.status(401).json('Unauthorized');
        }

        db.role.findAll()
            .then((result) => res.json(result))
            .catch(err => res.status(500).json(err))
    });

    app.get( "/api/roles/:id", (req, res) => {

        // Access
        if (req.auth.guest) {
            return res.status(401).json('Unauthorized');
        }

        db.role.findByPk(req.params.id)
            .then((result) => res.json(result))
            .catch(err => res.status(500).json(err))
    });

};
