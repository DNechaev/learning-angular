const crypto = require("crypto");

class Session {

        constructor(app, db) {
            this.app = app;
            this.db = db;
        }

        registration(email, password, name) {
            return new Promise((resolve, reject) => {

                        this.db.user.create({
                            email, password, name
                        }).then( user => {

                                user.setRoles([3]).then(() => {


                                    this.db.user.findOne({
                                        where: {
                                            email: email,
                                            password: password
                                        },
                                        attributes: ['id', 'name', 'email']
                                    }).then(user => {
                                        if (!user) return reject('Unauthorized');

                                        const sessionId = crypto.randomBytes(16).toString("hex");
                                        this.db.user.update({
                                            ssid: sessionId,
                                        }, {
                                            where: {
                                                id: user.id
                                            }
                                        }).then( () => {
                                            this.getUserBySsid(sessionId)
                                                .then( user => resolve(user) )
                                                .catch( err => reject(err) );
                                        }).catch( err => reject(err) );
                                        

                                    }).catch(err => reject(err) );

                                }).catch( err => reject(err) )

                            })
                            .catch(err => reject(err));
            });
        }

        login(email, password) {
            return new Promise((resolve, reject) => {

                this.db.user.findOne({
                    where: {
                        email: email,
                        password: password
                    },
                    attributes: ['id', 'name', 'email']
                }).then(user => {
                    if (!user) return reject('Unauthorized');

                    const sessionId = crypto.randomBytes(16).toString("hex");
                    this.db.user.update({
                        ssid: sessionId,
                    }, {
                        where: {
                            id: user.id
                        }
                    }).then( () => {
                        this.getUserBySsid(sessionId)
                            .then( user => resolve(user) )
                            .catch( err => reject(err) );
                    }).catch( err => reject(err) );
                }).catch( err => reject(err) )

            });
        }

        getUserBySsid(ssid) {
            return new Promise((resolve, reject) => {

                this.db.user.findOne({
                    where: {ssid: ssid},
                    //attributes: ['id', 'name'],
                    include: [
                        {
                            model: this.db.role,
                            as: 'roles',
                            attributes: ['id', 'name'],
                        }
                    ]
                }).then(user => {
                        if (user !== null) {
                            return resolve(user);
                        }
                        return reject('Unauthorized');
                    })
                    .catch( err => reject(err) );

            });
        }

        logout(ssid) {
            return new Promise((resolve, reject) => {

                this.getUserBySsid(ssid)
                    .then(user => {
                        this.db.user.update({
                            ssid: null,
                        }, {
                            where: {
                                id: user.id
                            }
                        }).then( () => resolve({}) )
                            .catch( err => reject(err) );
                    }).catch( err => reject(err) )

            });
        }

        checkAccess(req, roles) {

            if (req.auth.guest) {
                return false;
            }

            let user = this.getCurrentUser(req);
            console.log('checkAccess', user);

            let userRoles = user['roles'].map( v => v.name);

            let access = false;
            roles.forEach(function(element) {
                if (userRoles.includes(element)) {
                    access = true;
                }
            });

            return access;
        }

        getCurrentUser(req) {
            if (req.auth.guest) return null;
            return JSON.parse(JSON.stringify(req.auth.user));
        }

}

module.exports = (app, db) =>  {
    app.Session = new Session(app, db);
};
