module.exports = (app, db) => {

    app.post( "/api/session/login", (req, res) =>
        app.Session.login(req.body.email, req.body.password)
            .then(result => res.json(result) )
            .catch( err => {
                console.log('Error [Session.login]: ', err);
                return res.status(500).json(err)
            } )
    );

    app.post( "/api/session/logout", (req, res) => {

        // Access
        if (req.auth.guest) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        let user = app.Session.getCurrentUser(req);
        app.Session.logout(user.ssid)
            .then(result => res.json(result))
            .catch(err => res.status(500).json(err))
    });

    app.get( "/api/session/profile", (req, res) => {

        // Access
        if (req.auth.guest) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        let user = app.Session.getCurrentUser(req);
        if (user) {
            res.json(user);
        } else {
            res.status(500).json({message: 'User not found'})
        }

    });

    app.post("/api/session/registration", (req, res) => {

        // Access
        if (!req.auth.guest) {
            return res.status(401).json('You are already registered');
        }

        app.Session.registration(req.body.email, req.body.password, req.body.name)
            .then(result => res.json(result) )
            .catch( err => {
                console.log('Error [Session.registration]: ', err);
                return res.status(500).json(err)
            } )

    });

};
