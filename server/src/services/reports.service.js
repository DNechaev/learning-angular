
class ReportsService {

    static async sql(db, query) {
        const data = await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT});
        if ( data && data.length ) {
            return data[0];
        }
        return null;
    }

    static async getReports( db, currentUserId ) {

        const usersTotal = await this.sql(db, "SELECT COUNT(*) as count FROM `user` ");
        const usersAdmin = await this.sql(db,
            "select COUNT(*) as count " +
            "from user, user_role, role " +
            "where " +
            "  user.id = user_role.userId " +
            "  AND role.id = user_role.roleId " +
            "  AND role.name = 'ADMIN' ");
        const usersManager = await this.sql(db,
            "select COUNT(*) as count " +
            "from user, user_role, role " +
            "where " +
            "  user.id = user_role.userId " +
            "  AND role.id = user_role.roleId " +
            "  AND role.name = 'MANAGER' ");
        const usersUser = await this.sql(db,
            "select COUNT(*) as count " +
            "from user, user_role, role " +
            "where " +
            "  user.id = user_role.userId " +
            "  AND role.id = user_role.roleId " +
            "  AND role.name = 'USER' ");

        const eventsTotal = await this.sql(db,"select SUM(purchase.tickets_count) as count, SUM(purchase.tickets_count * event.price) as sum from event, " +
            "purchase where event.id = purchase.event_id " + (currentUserId ? "AND purchase.user_id = " + currentUserId : ""));

        const eventsWill = await this.sql(db,"select SUM(purchase.tickets_count) as count, SUM(purchase.tickets_count * event.price) as sum from event, " +
            "purchase where event.id = purchase.event_id AND event.date_begin > NOW() " + (currentUserId ? "AND purchase.user_id = " + currentUserId : ""));

        const eventsGoes = await this.sql(db,"select SUM(purchase.tickets_count) as count, SUM(purchase.tickets_count * event.price) as sum from event, " +
            "purchase where event.id = purchase.event_id AND event.date_begin <= NOW() AND event.date_end >= NOW() " + (currentUserId ? "AND purchase.user_id = " + currentUserId : ""));

        const eventsPassed = await this.sql(db,"select SUM(purchase.tickets_count) as count, SUM(purchase.tickets_count * event.price) as sum from event, " +
            "purchase where event.id = purchase.event_id AND event.date_end <= NOW() " + (currentUserId ? "AND purchase.user_id = " + currentUserId : ""));

        const purchases = await this.sql(db,"select SUM(purchase.tickets_count) as count, SUM(purchase.tickets_count * event.price) as sum, AVG(event.price) as avg from event, " +
            "purchase where event.id = purchase.event_id " + (currentUserId ? "AND purchase.user_id = " + currentUserId : ""));

        return new Promise((resolve, reject) => {
            resolve({
                users: {
                    total: (usersTotal.count || 0),
                    admins: (usersAdmin.count || 0),
                    managers: (usersManager.count || 0),
                    users: (usersUser.count || 0)
                },
                events: {
                    totalCount: (eventsTotal.count || 0),
                    totalSum: (eventsTotal.sum || 0),
                    willCount: (eventsWill.count || 0),
                    willSum: (eventsWill.sum || 0),
                    goesCount: (eventsGoes.count || 0),
                    goesSum: (eventsGoes.sum || 0),
                    passedCount: (eventsPassed.count || 0),
                    passedSum: (eventsPassed.sum || 0),
                },
                purchases: {
                    total: (purchases.count || 0),
                    sum: (purchases.sum || 0),
                    avg: (purchases.avg || 0),
                    price: (purchases.sum/purchases.count || 0),
                }
            });
        });
    }

}

export default ReportsService;
