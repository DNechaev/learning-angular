import eventsService from '../services/events.service';
import SessionService from "../services/session.service";
import Role from "../shared/roles.enum";
import purchasesService from "../services/purchases.service";

class EventsController {

    static async getAll(ctx) {
        ctx.body = await eventsService.getAll(ctx.db, ctx.query, ctx.authorizedUser.id);
    }

    static async getById(ctx) {
        const event = await eventsService.getById(ctx.db, ctx.params.id);
        if ( event ) {
            ctx.body = event;
        } else {
            ctx.status = 404;
            ctx.body = {
                message: 'Event not found.'
            };
        }
    }

    static async create(ctx) {
        ctx.body = await eventsService.create(ctx.db, ctx.request.body);
    }

    static async update(ctx) {
        ctx.body = await eventsService.update(ctx.db, ctx.params.id, ctx.request.body);
    }

    static async delete(ctx) {
        await eventsService.delete(ctx.db, ctx.params.id);
        ctx.body = { deletedId: ctx.params.id };
    }

}

export default EventsController;
