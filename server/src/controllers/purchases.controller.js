import purchasesService from '../services/purchases.service';
import SessionService from "../services/session.service";
import Role from "../shared/roles.enum";

class PurchasesController {

    static async getAll(ctx) {
        if ( !SessionService.userHasRoles( ctx.authorizedUser, [Role.ADMIN] )) {
            ctx.body = await purchasesService.getAll(ctx.db, ctx.authorizedUser.id, ctx.query);
        } else {
            ctx.body = await purchasesService.getAll(ctx.db, null, ctx.query);
        }
    }

    static async getById(ctx) {
        let event;
        if ( !SessionService.userHasRoles( ctx.authorizedUser, [Role.ADMIN] )) {
            event = await purchasesService.getById(ctx.db, ctx.params.id, ctx.authorizedUser.id);
        } else {
            event = await purchasesService.getById(ctx.db, ctx.params.id);
        }
        if ( event ) {
            ctx.body = event;
        } else {
            ctx.status = 404;
            ctx.body = {
                message: 'Purchase not found.'
            };
        }
    }

    static async create(ctx) {
        ctx.body = await purchasesService.create(ctx.db, ctx.request.body);
    }

    static async update(ctx) {
        ctx.body = await purchasesService.update(ctx.db, ctx.params.id, ctx.request.body);
    }

    static async delete(ctx) {
        await purchasesService.delete(ctx.db, ctx.params.id);
        ctx.body = { deletedId: ctx.params.id };
    }

    static async buy(ctx) {
        ctx.body = await purchasesService.buy(ctx.db, ctx.authorizedUser.id, ctx.params.id, ctx.request.body);
    }
}

export default PurchasesController;
