import Utils from '../shared/utils';

class PurchasesService {

    static async getAll( db, userId, params ) {

        const page     = +(params.page || 1);
        const pageSize = +(params.pageSize || 10);

        const where = {};

        // Only self purchases
        if (userId) {
            where.userId = userId;
        }
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
*/
        console.log('where', where);

        console.log('---------------------------------------------------');
        const result = await db.purchase.findAndCountAll(
            Utils.paginate(
            {
                    // logging: console.log,
                    where: where,
                    include: [
                        {
                            model: db.user,
                            as: 'user',
                            attributes: ['id', 'name'],
                        },
                        {
                            model: db.event,
                            as: 'event',
                            attributes: ['id', 'name'],
                        }
                    ],
                    distinct: true, // correct full record count
                }, {
                    page, pageSize
                }
            )
        );

        result.page = page;
        result.pageSize = pageSize;
        return result;
    }

    static async getById( db, purchaseId ) {
        return db.purchase.findByPk( purchaseId, {
            include: [
                {
                    model: db.user,
                    as: 'user',
                    attributes: ['id', 'name'],
                },
                {
                    model: db.event,
                    as: 'event',
                    attributes: ['id', 'name'],
                }
            ],
        });
    }


    static async create( db, purchaseValue ) {
        let newPurchase;
        let transaction;
        let newData = {
            name: purchaseValue.name,
            date: purchaseValue.date,
            userId: purchaseValue.userId,
            eventId: purchaseValue.eventId,
            ticketsCount: purchaseValue.ticketsCount,
        };
        try {
            transaction = await db.sequelize.transaction();
            newPurchase = await db.purchase.create( newData, { transaction } );
            await transaction.commit();
        } catch (err) {
            if (err) await transaction.rollback();
            throw err;
        }
        return await this.getById(db, newPurchase.id);
    }

    static async update( db, purchaseId, purchaseValue ) {
        let newData = {
            name: purchaseValue.name,
            date: purchaseValue.date,
            userId: purchaseValue.userId,
            eventId: purchaseValue.eventId,
            ticketsCount: purchaseValue.ticketsCount,
        };

        let transaction;
        try {
            transaction = await db.sequelize.transaction();
            let purchase = await db.purchase.findByPk(purchaseId);
            await purchase.update(newData, {
                where: {id: purchaseId}
            }, {transaction});
            await transaction.commit();
        } catch (err) {
            if (err) await transaction.rollback();
            throw err;
        }
        return await this.getById(db, purchaseId);
    }

    static async delete( db, purchaseId ) {
        return await db.purchase.destroy({
            where: {
                id: purchaseId
            }
        })
    }

    static async buy( db, userId, eventId, purchaseValue ) {
        let newPurchase;
        let transaction;
        let newData = {
            date: new Date(),
            userId: purchaseValue.userId,
            eventId: eventId,
            ticketsCount: purchaseValue.ticketsCount,
        };
        try {
            transaction = await db.sequelize.transaction();
            newPurchase = await db.purchase.create( newData, { transaction } );
            await transaction.commit();
        } catch (err) {
            if (err) await transaction.rollback();
            throw err;
        }
        return await this.getById(db, newPurchase.id);
    }
}

export default PurchasesService;
