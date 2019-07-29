const SessionService = require('../services/session.service');

module.exports = ( allowRoles, allowAuthorizedUser = false, allowGuest = false) => {

    return async (ctx, next) => {

        // All guest
        if ( !ctx.authorizedUser && allowGuest ) {
            return await next();
        }

        // All authorized user
        if ( ctx.authorizedUser && allowAuthorizedUser ) {
           return await next();
        }

        // User has allowed roles
        if ( ctx.authorizedUser && SessionService.userHasRoles( ctx.authorizedUser, allowRoles )) {
            return await next();
        }

        ctx.status = 403;
        ctx.body = {
            message: 'Forbidden'
        };

    }

};
