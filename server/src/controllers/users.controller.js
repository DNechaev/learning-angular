const usersService = require('../services/users.service');

module.exports = class UsersController {

    static async getAll(ctx) {
        ctx.body = await usersService.getAll(ctx.db, ctx.query);
    }

    static async getById(ctx) {
        const user = await usersService.getById(ctx.db, ctx.params.id);
        if ( user ) {
            ctx.body = user;
        } else {
            ctx.status = 404;
            ctx.body = {
                message: 'User not found.'
            };
        }
    }

    static async create(ctx) {
        ctx.body = await usersService.create(ctx.db, ctx.request.body);
    }

    static async update(ctx) {
        ctx.body = await usersService.update(ctx.db, ctx.params.id, ctx.request.body);
    }

    static async delete(ctx) {
        await usersService.delete(ctx.db, ctx.params.id);
        ctx.body = { deletedId: ctx.params.id };
    }

};
