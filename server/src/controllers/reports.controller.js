import reportsService from '../services/reports.service';
import SessionService from '../services/session.service';
import Role from '../shared/roles.enum';

class ReportsController {

    static async getReport(ctx) {
        if ( !SessionService.userHasRoles( ctx.authorizedUser, [Role.ADMIN, Role.MANAGER] )) {
            ctx.body = await reportsService.getReports(ctx.db, ctx.authorizedUser.id);
        } else {
            ctx.body = await reportsService.getReports(ctx.db);
        }
    }

}

export default ReportsController;
