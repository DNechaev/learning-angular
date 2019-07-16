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
            return res.status(401).json('Unauthorized');
        }

        app.Session.logout(req.body.ssid)
            .then(result => res.json(result))
            .catch(err => res.status(500).json(err))
    });

    app.get( "/api/session/profile", (req, res) => {

        // Access
        if (req.auth.guest) {
            return res.status(401).json('Unauthorized');
        }

        app.Session.getUserBySsid(req.body.ssid)
            .then(result => res.json(result))
            .catch(err => res.status(500).json(err))

    });

};
