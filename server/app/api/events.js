module.exports = (app, db) => {
    app.get( "/api/events", (req, res) => {

        // Access
        if (req.auth.guest) {
            return res.status(401).json('Unauthorized');
        }

        let where = {};

        // name
        if (typeof req.query.name === 'string') {
            where.name = {
                [db.Sequelize.Op.or]: [
                    {[db.Sequelize.Op.like]: req.query.name},
                    {[db.Sequelize.Op.like]: '%' +req.query.name},
                    {[db.Sequelize.Op.like]: '%' +req.query.name + '%'},
                    {[db.Sequelize.Op.like]: req.query.name + '%'}
                ]
            };
        }

        db.event.findAll({
            where: where,
            include: [
                {
                    model: db.purchase,
                    as: 'purchases',
                    //attributes: ['id', 'name'],
                }
            ]
        }).then((result) => res.json(result))
          .catch( err => res.status(500).json(err) );

    });

    app.get( "/api/events/:id", (req, res) => {

        // Access
        if (req.auth.guest) {
            return res.status(401).json('Unauthorized');
        }

        db.event.findByPk(req.params.id, {
            include: [
                {
                    model: db.purchase,
                    as: 'purchases',
                    //attributes: ['id', 'name'],
                }
            ]
        }).then( (result) => res.json(result))
          .catch( err => res.status(500).json(err) )

    });

    app.post("/api/events", (req, res) => {

        // Access
        if (!app.Session.checkAccess(req, ['MANAGER'])) {
            if (req.auth.guest) {
                return res.status(401).json('Unauthorized');
            }
            return res.status(403).json('Forbidden');
        }

        db.event.create({
            name:      req.body.name,
            dateBegin: req.body.dateBegin,
            dateEnd:   req.body.dateEnd,
            price:     req.body.price,
            count:     req.body.count
        }).then( (result) => res.json(result) )
          .catch( err => res.status(500).json(err))

    });

    app.put( "/api/events/:id", (req, res) => {

        // Access
        if (!app.Session.checkAccess(req, ['MANAGER'])) {
            if (req.auth.guest) {
                return res.status(401).json('Unauthorized');
            }
            return res.status(403).json('Forbidden');
        }

        db.event.update({
                name:      req.body.name,
                dateBegin: req.body.dateBegin,
                dateEnd:   req.body.dateEnd,
                price:     req.body.price,
                count:     req.body.count
            },
            {
                where: {
                    id: req.params.id
                }
            }).then( (result) => res.json(result) )
              .catch( err => res.status(500).json(err) );

    });

    app.delete( "/api/events/:id", (req, res) => {

        // Access
        if (!app.Session.checkAccess(req, ['MANAGER'])) {
            if (req.auth.guest) {
                return res.status(401).json('Unauthorized');
            }
            return res.status(403).json('Forbidden');
        }

        db.event.destroy({
            where: {
                id: req.params.id
            }
        }).then((result) => res.json(result))
            .catch(err => res.status(500).json(err));
    });
};
