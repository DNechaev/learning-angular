import Utils from '../shared/utils';

class UsersService {

    static async getAll( db, params ) {

        const page     = +(params.page || 1);
        const pageSize = +(params.pageSize || 10);

        const where = {};

        // name
        if (typeof params.name === 'string' && params.name.length) {
            let queryString = params.name;
            where.name = {
                [db.Sequelize.Op.or]: [
                    {[db.Sequelize.Op.like]: queryString},
                    {[db.Sequelize.Op.like]: '%' + queryString},
                    {[db.Sequelize.Op.like]: '%' + queryString + '%'},
                    {[db.Sequelize.Op.like]: queryString + '%'}
                ]
            };
        }

        // email
        if (typeof params.email === 'string' && params.email.length) {
            let queryString = params.email;
            where.email = {
                [db.Sequelize.Op.or]: [
                    {[db.Sequelize.Op.like]: queryString},
                    {[db.Sequelize.Op.like]: '%' + queryString},
                    {[db.Sequelize.Op.like]: '%' + queryString + '%'},
                    {[db.Sequelize.Op.like]: queryString + '%'}
                ]
            };
        }

        // filter
        if (typeof params.filter === 'string' && params.filter.length) {
            let queryString = params.filter;
            where[db.Sequelize.Op.or] = [
                {name: {[db.Sequelize.Op.like]:  queryString}},
                {name: {[db.Sequelize.Op.like]:  '%' + queryString}},
                {name: {[db.Sequelize.Op.like]:  '%' + queryString + '%'}},
                {name: {[db.Sequelize.Op.like]:  queryString + '%'}},
                {email: {[db.Sequelize.Op.like]: queryString}},
                {email: {[db.Sequelize.Op.like]: '%' + queryString}},
                {email: {[db.Sequelize.Op.like]: '%' + queryString + '%'}},
                {email: {[db.Sequelize.Op.like]: queryString + '%'}},
            ];
        }

        const result = await db.user.findAndCountAll(
            Utils.paginate(
            {
                    logging: console.log,
                    where: where,
                    include: [
                        {
                            model: db.role,
                            as: 'roles',
                            attributes: ['id', 'name'],
                        }
                    ],
                    distinct:true
                }, {
                    page, pageSize
                }
            )
        );

        result.page = page;
        result.pageSize = pageSize;
        return result;
    }

    static async getById( db, userId ) {
        return await db.user.findByPk( userId, {
            include: [
                {
                    model: db.role,
                    as: 'roles',
                    attributes: ['id', 'name'],
                }
            ]
        });
    }

    static async getBySsid( db, userSsid ) {
        return await db.user.findOne({
            where: {
                ssid: userSsid
            },
            include: [
                {
                    model: db.role,
                    as: 'roles',
                    attributes: ['id', 'name'],
                }
            ]
        });
    }

    static async create( db, userValue ) {
        let newUser;
        let transaction;
        let newData = {
            name: userValue.name,
            email: userValue.email,
            password: userValue.password
        };
        if ( userValue.ssid ) {
            newData.ssid = userValue.ssid;
        }
        try {
            transaction = await db.sequelize.transaction();
            newUser = await db.user.create( newData, { transaction } );
            if ( userValue.roles ) {
                await newUser.setRoles( userValue.roles, {transaction} );
            }
            await transaction.commit();
        } catch (err) {
            if (err) await transaction.rollback();
            throw err;
        }
        return await this.getById(db, newUser.id);
    }

    static async update( db, userId, userValue ) {
        let newData = {
            name: userValue.name,
            email: userValue.email
        };

        if (userValue.password) {
            newData.password = userValue.password;
        }

        let transaction;
        try {
            transaction = await db.sequelize.transaction();
            let user = await db.user.findByPk(userId);
            await user.update(newData, {
                where: {id: userId}
            }, {transaction});

            if (userValue.roles) {
                await user.setRoles(userValue.roles, {transaction});
            }

            await transaction.commit();
        } catch (err) {
            if (err) await transaction.rollback();
            throw err;
        }
        return await this.getById(db, userId);
    }

    static async delete( db, userId ) {
        if ( +userId === 1 ) {
            throw new Error('Access denied');
        }
        return await db.user.destroy({
            where: {
                id: userId
            }
        })
    }

}

export default UsersService;
