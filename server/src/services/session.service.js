class SessionService {


    static async login( db, userValue ) {

        const user = await db.user.findOne({
            where: {
                email: userValue.email,
                password: userValue.password
            },
            attributes: ['id', 'name', 'email']
        });

        if ( !user ) {
            throw new Error('Email or Password wrong.');
        }

        await user.update({ ssid: userValue.ssid });

        return await db.user.findOne({
            where: { ssid: userValue.ssid },
            include: [
                {
                    model: db.role,
                    as: 'roles',
                    attributes: ['id', 'name'],
                }
            ]
        });

    }


    static async logout( db, userSsid ) {
        const user = await db.user.findOne({
            where: { ssid: userSsid },
            include: [
                {
                    model: db.role,
                    as: 'roles',
                    attributes: ['id', 'name'],
                }
            ]
        });
        if ( user ) {
            await user.update({ ssid: null });
        }
    }


    static userHasRoles( user, roles = [] ) {

        if (!user) {
            return false;
        }

        let userRoles = user['roles'].map( v => v.name);
        let access = false;
        roles.forEach(element => {
            if (userRoles.includes(element)) {
                access = true;
            }
        });

        return access;

    }

}

export default SessionService;
