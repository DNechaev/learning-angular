import Utils from '../shared/utils';

class EventsService {

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

        // dateBeginFrom
        if (typeof params.dateBeginFrom === 'string' && params.dateBeginFrom.length) {
            where.date_begin = {
                [db.Sequelize.Op.gte]: params.dateBeginFrom
            };
        }

        // dateBeginTo
        if (typeof params.dateBeginTo === 'string' && params.dateBeginTo.length) {
            where.date_begin = {
                ...where.date_begin,
                [db.Sequelize.Op.lte]: params.dateBeginTo
            };
        }

        // dateEndFrom
        if (typeof params.dateEndFrom === 'string' && params.dateEndFrom.length) {
            where.date_end = {
                [db.Sequelize.Op.gte]: params.dateEndFrom
            };
        }

        // dateEndTo
        if (typeof params.dateEndTo === 'string' && params.dateEndTo.length) {
            where.date_end = {
                ...where.date_end,
                [db.Sequelize.Op.lte]: params.dateEndTo
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
                {price: {[db.Sequelize.Op.like]: queryString}},
                {price: {[db.Sequelize.Op.like]: '%' + queryString}},
                {price: {[db.Sequelize.Op.like]: '%' + queryString + '%'}},
                {price: {[db.Sequelize.Op.like]: queryString + '%'}},
            ];
        }

        console.log('where', where);

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
            row.dataValues.ticketsAvailable = row.dataValues.ticketsCount - row.dataValues.ticketsPurchased;
        });


        result.page = page;
        result.pageSize = pageSize;
        return result;
    }

    static async getById( db, eventId ) {
        return await db.event.findByPk( eventId );
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
