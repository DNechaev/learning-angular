module.exports = (app, db) => {

    app.post( "/api/sessions/login", (req, res) =>
        app.Session.login(req.body.email, req.body.password)
            .then(result => res.json(result) )
            .catch( err => res.status(500).json(err) )
    );

    app.post( "/api/sessions/logout", (req, res) => {

        // Access
        if (req.auth.guest) {
            return res.status(401).json('Unauthorized');
        }

        app.Session.logout(req.body.ssid)
            .then(result => res.json(result))
            .catch(err => res.status(500).json(err))
    });

    app.get( "/api/sessions/profile", (req, res) => {

        // Access
        if (req.auth.guest) {
            return res.status(401).json('Unauthorized');
        }

        app.Session.getUserBySsid(req.body.ssid)
            .then(result => res.json(result))
            .catch(err => res.status(500).json(err))

    });

};
