module.exports = (app, db) => {
    return function (req, res, next) {

        req.auth = {
            guest: true,
            user:  null
        };

        let sessionId = req.header('X-SSID') || req.body.ssid || req.query.ssid;

        if (typeof sessionId === 'string') {
            console.log('SessionId: ', sessionId);
            app.Session.getUserBySsid(sessionId)
                .then( user => {
                    req.auth.guest = false;
                    req.auth.user  = user;
                    return next();
                }).catch( err => next({
                    name: 'UnauthorizedError',
                    message: err
                }) )
        } else {
            console.log('SessionId: empty');
            return next();
        }

    };
};
