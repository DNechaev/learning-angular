import crypto from 'crypto';

import sessionService from '../services/session.service';
import usersService from '../services/users.service';

class SessionController {

    static profile(ctx) {
        if ( ctx.authorizedUser ) {
            ctx.body = ctx.authorizedUser;
        } else {
            ctx.body = {};
        }
    }

    static async registration(ctx) {
        const ssid = crypto.randomBytes(16).toString("hex");
        ctx.body = await usersService.create(ctx.db, { ...ctx.request.body, ssid, roles: [3] });
    }

    static async login(ctx) {
        const ssid = crypto.randomBytes(16).toString("hex");
        ctx.body = await sessionService.login(ctx.db, { ...ctx.request.body, ssid });
    }

    static async logout(ctx) {
        if ( ctx.authorizedUser ) {
            await sessionService.logout(ctx.db, ctx.authorizedUser.ssid );
        }
        ctx.body = {};
    }

}

export default SessionController;
