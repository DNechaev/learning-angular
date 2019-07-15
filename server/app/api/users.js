module.exports = (app, db) => {
    app.get( "/api/users", (req, res) => {

        // Access
        if (!app.Session.checkAccess(req, ['ADMIN'])) {
            if (req.auth.guest) {
                return res.status(401).json('Unauthorized');
            }
            return res.status(403).json('Forbidden');
        }

        console.log('req.query', req.query);

        let where = {};

        // name
        if (typeof req.query.name === 'string') {
            //where.name = {[db.Sequelize.Op.like]: req.query.name}};
            where.name = {
                [db.Sequelize.Op.or]: [
                    {[db.Sequelize.Op.like]: req.query.name},
                    {[db.Sequelize.Op.like]: '%' +req.query.name},
                    {[db.Sequelize.Op.like]: '%' +req.query.name + '%'},
                    {[db.Sequelize.Op.like]: req.query.name + '%'}
                ]
            };
        }

        db.user.findAll({
            logging: console.log,
            where: where,
            include: [
                {
                    model: db.role,
                    as: 'roles',
                    attributes: ['id', 'name'],
                }
            ]
        }).then((result) => res.json(result))
            .catch( err => res.status(500).json(err) );

    });

    app.get( "/api/users/:id", (req, res) => {

        // Access
        if (!app.Session.checkAccess(req, ['ADMIN'])) {
            if (req.auth.guest) {
                return res.status(401).json('Unauthorized');
            }
            return res.status(403).json('Forbidden');
        }

        db.user.findByPk(req.params.id, {
            include: [
                {
                    model: db.role,
                    as: 'roles',
                    attributes: ['id', 'name'],
                }
            ]
        }).then((result) => res.json(result))
            .catch(err => res.status(500).json(err));

    });

    app.post("/api/users", (req, res) => {

        // Access
        if (!app.Session.checkAccess(req, ['ADMIN'])) {
            if (req.auth.guest) {
                return res.status(401).json('Unauthorized');
            }
            return res.status(403).json('Forbidden');
        }

        db.user.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }).then(result => res.json(result))
            .catch(err => res.status(500).json(err));

    });

    app.put( "/api/users/:id", (req, res) => {

        // Access
        if (!app.Session.checkAccess(req, ['ADMIN'])) {
            if (req.auth.guest) {
                return res.status(401).json('Unauthorized');
            }
            return res.status(403).json('Forbidden');
        }

        db.user.update({
                name: req.body.name,
                // email: req.body.email,
                password: req.body.password
            },
            {
                where: {
                    id: req.params.id
                }
            }).then((result) => res.json(result))
            .catch(err => res.status(500).json(err));

    });

    app.delete( "/api/users/:id", (req, res) => {

        // Access
        if (!app.Session.checkAccess(req, ['ADMIN'])) {
            if (req.auth.guest) {
                return res.status(401).json('Unauthorized');
            }
            return res.status(403).json('Forbidden');
        }

        // It is forbidden to delete the most important admin
        if (req.params.id === '1') {
            return res.status(403).json('Forbidden');
        }

        db.user.destroy({
            where: {
                id: req.params.id
            }
        }).then((result) => res.json(result))
          .catch(err => res.status(500).json(err));

    });
};
