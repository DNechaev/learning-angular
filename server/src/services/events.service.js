import Utils from '../shared/utils';

class EventsService {

    static makeEvent(event, currentUserId) {
        const purchases = event.dataValues.purchases;
        event.dataValues.myPurchaseId = null;
        if (currentUserId) {
            event.dataValues.myPurchaseId = purchases.reduce((id, purchase) => purchase.userId === currentUserId ? purchase.id : id, event.dataValues.myPurchaseId);
        }
        event.dataValues.purchasesCount   = purchases.length;
        event.dataValues.ticketsPurchased = purchases.reduce((sum, purchase) => sum + purchase.dataValues.ticketsCount, 0);
        event.dataValues.ticketsAvailable = event.dataValues.ticketsCount - event.dataValues.ticketsPurchased;

        const now = new Date();
        event.dataValues.status = (now < event.dataValues.dateBegin ? 3 : (now > event.dataValues.dateEnd ? 1 : 2));

        return event;
    }

    static async getAll( db, params, currentUserId ) {

        const page     = +(params.page || 1);
        const pageSize = +(params.pageSize || 10);
        const clientWhere = JSON.parse(params.where || {});
        const clientOrder  = JSON.parse(params.order || {});

        // --------------------------------------------------------------------
        // WHERE
        const where = {};

        // name
        if (typeof clientWhere.name === 'string' && clientWhere.name.length) {
            let queryString = clientWhere.name;
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
        if (typeof clientWhere.dateBeginFrom === 'string' && clientWhere.dateBeginFrom.length) {
            where.date_begin = {
                [db.Sequelize.Op.gte]: clientWhere.dateBeginFrom
            };
        }

        // dateBeginTo
        if (typeof clientWhere.dateBeginTo === 'string' && clientWhere.dateBeginTo.length) {
            where.date_begin = {
                ...where.date_begin,
                [db.Sequelize.Op.lte]: clientWhere.dateBeginTo
            };
        }

        // dateEndFrom
        if (typeof clientWhere.dateEndFrom === 'string' && clientWhere.dateEndFrom.length) {
            where.date_end = {
                [db.Sequelize.Op.gte]: clientWhere.dateEndFrom
            };
        }

        // dateEndTo
        if (typeof clientWhere.dateEndTo === 'string' && clientWhere.dateEndTo.length) {
            where.date_end = {
                ...where.date_end,
                [db.Sequelize.Op.lte]: clientWhere.dateEndTo
            };
        }

        // filter
        if (typeof clientWhere.filter === 'string' && clientWhere.filter.length) {
            let queryString = clientWhere.filter;
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

        // console.log('where', where);

        // --------------------------------------------------------------------
        // ORDER
        const order = [];
        Object.keys(clientOrder).forEach((key) => {
            order.push([ key, clientOrder[key] ]);
        });
        // console.log('order', order);

        // console.log('---------------------------------------------------');
        const result = await db.event.findAndCountAll(
            Utils.paginate(
            {
                    // logging: console.log,
                    where: where,
                    order: order,
                    include: [
                        {
                            model: db.purchase,
                            as: 'purchases',
                            attributes: ['id', 'userId', 'ticketsCount'],
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
            this.makeEvent(row, currentUserId);
        });


        result.page = page;
        result.pageSize = pageSize;
        return result;
    }

    static async getById( db, eventId ) {
        const event = await db.event.findByPk( eventId, {
            include: [
                {
                    model: db.purchase,
                    as: 'purchases',
                    attributes: ['id', 'userId', 'ticketsCount'],
                }
            ]
        });

        return this.makeEvent(event);
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
