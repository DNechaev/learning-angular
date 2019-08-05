class Utils {

    static paginate(query, { page, pageSize }) {
        const offset = ( page - 1 ) * pageSize;
        const limit = offset + pageSize;

        return {
            ...query,
            offset,
            limit,
        }
    };

}

export default Utils;
