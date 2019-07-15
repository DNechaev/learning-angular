module.exports = (app, db) => {
    return function (req, res, next) {

        req.auth = {
            guest: true,
            user: undefined
        };

        let ssid = req.body.ssid || req.query.ssid;
        if (typeof ssid === 'string') {
            console.log('SSID: ', ssid);
            app.Session.getUserBySsid(ssid)
                .then( user => {
                    req.auth.guest = false;
                    req.auth.user  = user;
                    return next();
                }).catch( err => next() )
        } else {
            console.log('SSID: empty');
            return next();
        }
    };
};
