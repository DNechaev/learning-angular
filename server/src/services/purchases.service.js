import Utils from '../shared/utils';

class PurchasesService {

    static makePurchase(purchase) {
        purchase.dataValues.sum = purchase.dataValues.ticketsCount * purchase.dataValues.event.price;
        return purchase;
    }

    static async getAll( db, currentUserId, params ) {

        const page     = +(params.page || 1);
        const pageSize = +(params.pageSize || 10);
        const clientWhere = JSON.parse(params.where || {});
        const clientOrder  = JSON.parse(params.order || {});

        // --------------------------------------------------------------------
        // WHERE
        const where = {};

        // Only self purchases
        if (currentUserId) {
            where.userId = currentUserId;
        }

        // dateFrom
        if (typeof clientWhere.dateFrom === 'string' && clientWhere.dateFrom.length) {
            where.date = {
                [db.Sequelize.Op.gte]: clientWhere.dateFrom
            };
        }

        // dateTo
        if (typeof clientWhere.dateTo === 'string' && clientWhere.dateTo.length) {
            where.date = {
                ...where.date,
                [db.Sequelize.Op.lte]: clientWhere.dateTo
            };
        }
        console.log('where', where);

        // --------------------------------------------------------------------
        // ORDER
        const order = [];
        Object.keys(clientOrder).forEach((key) => {
            order.push([ key, clientOrder[key] ]);
        });
        console.log('order', order);

        console.log('---------------------------------------------------');
        const result = await db.purchase.findAndCountAll(
            Utils.paginate(
            {
                    // logging: console.log,
                    where: where,
                    order: order,
                    include: [
                        {
                            model: db.user,
                            as: 'user',
                            attributes: ['id', 'name'],
                        },
                        {
                            model: db.event,
                            as: 'event',
                            attributes: ['id', 'name', 'price'],
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
            this.makePurchase(row);
        });

        result.page = page;
        result.pageSize = pageSize;
        return result;
    }

    static async getById( db, purchaseId, currentUserId ) {
        const where = {};
        // Only self purchases
        if (currentUserId) {
            where.userId = currentUserId;
        }
        return db.purchase.findByPk( purchaseId, {
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
            userId: userId,
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
