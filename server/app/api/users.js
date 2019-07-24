module.exports = (app, db) => {



    const paginate = (query, { page, pageSize }) => {
        const offset = ( page - 1 ) * pageSize;
        const limit = offset + pageSize;

        return {
            ...query,
            offset,
            limit,
        }
    };


    app.get( "/api/users", (req, res) => {

        // Access
        if (!app.Session.checkAccess(req, ['ADMIN'])) {
            if (req.auth.guest) {
                return res.status(401).json('Unauthorized');
            }
            return res.status(403).json('Forbidden');
        }

        page     = (+req.query.page) ? +req.query.page : 1;
        pageSize = (+req.query.page_size) ? +req.query.page_size : 10;

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

        // email
        if (typeof req.query.email === 'string') {
            where.email = req.query.email;
        }

        // filter
        if (typeof req.query.filter === 'string') {
            where[db.Sequelize.Op.or] = [
                {name: {[db.Sequelize.Op.like]: req.query.filter}},
                {name: {[db.Sequelize.Op.like]: '%' +req.query.filter}},
                {name: {[db.Sequelize.Op.like]: '%' +req.query.filter + '%'}},
                {name: {[db.Sequelize.Op.like]: req.query.filter + '%'}},
                {email: {[db.Sequelize.Op.like]: req.query.filter}},
                {email: {[db.Sequelize.Op.like]: '%' +req.query.filter}},
                {email: {[db.Sequelize.Op.like]: '%' +req.query.filter + '%'}},
                {email: {[db.Sequelize.Op.like]: req.query.filter + '%'}},
            ];
        }

        db.user.findAndCountAll(paginate(
            {
                logging: console.log,
                where: where,
                include: [
                    {
                        model: db.role,
                        as: 'roles',
                        attributes: ['id', 'name'],
                    }
                ],
                distinct:true
            }, { page, pageSize }))
            .then((result) => {
                    result.page = page;
                    result.pageSize = pageSize;
                    return res.json(result);
            })
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

        db.user/*.scope('full')*/.findByPk(req.params.id, {
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
        }).then(user => {
            user.setRoles(req.body.roles)
                .then(() => res.json(user))
                .catch(err => res.status(500).json(err));
        }).catch(err => res.status(500).json(err));

    });

    app.put( "/api/users/:id", (req, res) => {

        // Access
        if (!app.Session.checkAccess(req, ['ADMIN'])) {
            if (req.auth.guest) {
                return res.status(401).json('Unauthorized');
            }
            return res.status(403).json('Forbidden');
        }

        let newData = {
            name: req.body.name,
            email: req.body.email
        };

        if (req.body.password) {
            newData.password = req.body.password;
        }

        db.user.update(newData,
            {
                where: {
                    id: req.params.id
                }
            }).then( () => {
                db.user.findByPk(req.params.id)
                    .then(user => {
                        user.setRoles(req.body.roles)
                            .then(() => res.json({}))
                            .catch(err => res.status(500).json(err));
                    })
                    .catch(err => res.status(500).json(err));
            }).catch(err => res.status(500).json(err));

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
        }).then(() => res.json({}))
          .catch(err => res.status(500).json(err));

    });
};
