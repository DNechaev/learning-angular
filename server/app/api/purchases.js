module.exports = (app, db) => {
    app.get( "/api/purchases", (req, res) => {

        // Access
        if (req.auth.guest) {
            return res.status(401).json('Unauthorized');
        }

        let where = {};

        // userId
        if (typeof req.query.userId === 'string') {
            where.userId = req.query.userId;
        }

        // If we are not managers, we only look at our purchases.
        if (!app.Session.checkAccess(req, ['MANAGER'])) {
            where.userId = req.auth.user.id;
        }

        // eventId
        if (typeof req.query.eventId === 'string') {
            where.eventId = req.query.eventId;
        }

        db.purchase.findAll({
            where: where,
            include: [
                {
                    model: db.user,
                    as: 'user',
                    //attributes: ['id', 'name'],
                },
                {
                    model: db.event,
                    as: 'event',
                    //attributes: ['id', 'name'],
                }
            ]
        }).then((result) => res.json(result))
          .catch( err => res.status(500).json(err) );

    });

    app.get( "/api/purchases/:id", (req, res) => {

        // Access
        if (req.auth.guest) {
            return res.status(401).json('Unauthorized');
        }

        let where = {
            id: req.params.id
        };

        // If we are not managers, we only look at our purchases
        if (!app.Session.checkAccess(req, ['MANAGER'])) {
            where.userId = req.auth.user.id;
        }

        db.purchase.findOne({
            where: where,
            include: [
                {
                    model: db.user,
                    as: 'user',
                    //attributes: ['id', 'name'],
                },
                {
                    model: db.event,
                    as: 'event',
                    //attributes: ['id', 'name'],
                }
            ]
        }).then(result => res.json(result))
            .catch(err => res.status(500).json(err))

    });

    app.post("/api/purchases", (req, res) => {

        // Access
        if (req.auth.guest) {
            return res.status(401).json('Unauthorized');
        }

        // We can create only our purchases
        if ( req.body.userId !== req.auth.user.id ) {
            return res.status(403).json('Forbidden');
        }

        db.purchase.create({
            userId: req.body.userId,
            eventId: req.body.eventId,
            count: req.body.count
        }).then( result => res.json(result) )
            .catch(err => res.status(500).json(err) );

    });


    app.put( "/api/purchases/:id", (req, res) => {

        // Only managers can edit
        if (!app.Session.checkAccess(req, ['MANAGER'])) {
            if (req.auth.guest) {
                return res.status(401).json('Unauthorized');
            }
            return res.status(403).json('Forbidden');
        }

        db.purchase.update({
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


    app.delete( "/api/purchases/:id", (req, res) => {

        // Only managers can delete
        if (!app.Session.checkAccess(req, ['MANAGER'])) {
            if (req.auth.guest) {
                return res.status(401).json('Unauthorized');
            }
            return res.status(403).json('Forbidden');
        }

        db.purchase.destroy({
                where: {
                    id: req.params.id
                }
            }).then( (result) => res.json(result) )
                .catch( err => res.status(500).json(err) );

    });

};
