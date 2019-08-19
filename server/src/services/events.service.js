import Utils from '../shared/utils';

class EventsService {

    static async getAll( db, params ) {

        const page     = +(params.page || 1);
        const pageSize = +(params.pageSize || 10);

        const where = {};
/*
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
            where.email = params.email;
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
*/

        console.log('---------------------------------------------------');
        const result = await db.event.findAndCountAll(
            Utils.paginate(
            {
                    // logging: console.log,
                    where: where,
                    include: [
                        {
                            model: db.purchase,
                            as: 'purchases',
                            attributes: ['id', 'ticketsCount'],
                        }
                    ],
                    distinct: true, // correct full record count
                }, {
                    page, pageSize
                }
            )
        );

        // Summary info by purchases
        result.rows.forEach((row) => {
            let purchases = row.dataValues.purchases;
            row.dataValues.purchasesCount = purchases.length;
            row.dataValues.ticketsPurchased = purchases.reduce((sum, purchase) => sum + purchase.dataValues.ticketsCount, 0);
        });


        result.page = page;
        result.pageSize = pageSize;
        return result;
    }

    static async getById( db, eventId ) {
        return await db.event.findByPk( eventId, {
            /*include: [
                {
                    model: db.role,
                    as: 'roles',
                    attributes: ['id', 'name'],
                }
            ]*/
        });
    }

    static async create( db, eventValue ) {
        let newEvent;
        let transaction;
        let newData = {
            name: eventValue.name,
            dateBegin: eventValue.dateBegin,
            dateEnd: eventValue.dateEnd,
            price: eventValue.price,
            ticketsCount: eventValue.ticketsCount
        };
        try {
            transaction = await db.sequelize.transaction();
            newEvent = await db.event.create( newData, { transaction } );
            await transaction.commit();
        } catch (err) {
            if (err) await transaction.rollback();
            throw err;
        }
        return await this.getById(db, newEvent.id);
    }

    static async update( db, eventId, eventValue ) {
        let newData = {
            name: eventValue.name,
            dateBegin: eventValue.dateBegin,
            dateEnd: eventValue.dateEnd,
            price: eventValue.price,
            ticketsCount: eventValue.ticketsCount
        };

        let transaction;
        try {
            transaction = await db.sequelize.transaction();
            let event = await db.event.findByPk(eventId);
            await event.update(newData, {
                where: {id: eventId}
            }, {transaction});
            await transaction.commit();
        } catch (err) {
            if (err) await transaction.rollback();
            throw err;
        }
        return await this.getById(db, eventId);
    }

    static async delete( db, eventId ) {
        return await db.event.destroy({
            where: {
                id: eventId
            }
        })
    }

}

export default EventsService;
