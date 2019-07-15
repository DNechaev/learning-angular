const crypto = require("crypto");

class Session {

        constructor(app, db) {
            this.app = app;
            this.db = db;
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
                    const ssid = crypto.randomBytes(16).toString("hex");
                    this.db.user.update({
                        ssid: ssid,
                    }, {
                        where: {
                            id: user.id
                        }
                    }).then( user => resolve(user) )
                        .catch( err => reject(err) );
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
                        return reject('User not found');
                    })
                    .catch( err => reject(err) );

            });
        }

        logout(ssid) {
            return new Promise((resolve, reject) => {

                this.getUserBySsid(ssid)
                    .then(user => {
                        this.db.user.update({
                            ssid: '',
                        }, {
                            where: {
                                id: user.id
                            }
                        }).then( user => resolve(user) )
                            .catch( err => reject(err) );
                    }).catch( err => reject(err) )

            });
        }

        checkAccess(req, roles) {

            if (req.auth.guest) {
                return false;
            }

            let user = JSON.parse(JSON.stringify(req.auth.user));
            console.log('checkAccess', user);

            let userRoles = user['roles'].map( v => v.name);

            //console.log('checkAccess', userRoles);

            let access = false;
            roles.forEach(function(element) {
                if (userRoles.indexOf(element) != -1) {
                    access = true;
                }
            });

            return access;
        }

}

module.exports = (app, db) =>  {
    app.Session = new Session(app, db);
};
