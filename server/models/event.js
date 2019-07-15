module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('event', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: DataTypes.STRING,
            dateBegin: {
                type: DataTypes.DATE,
                field: 'date_begin'
            },
            dateEnd: {
                type: DataTypes.DATE,
                field: 'date_end'
            },
            price: DataTypes.DECIMAL(10, 2),
            count: DataTypes.INTEGER
        },
        {
            freezeTableName: true,
            timestamps: false,
            modelName: 'event'
        }
    );

    Event.associate = (models) => {
        Event.hasMany(models.purchase, {as: 'purchases', foreignKey: 'eventId', sourceKey: 'id'})
    };

    return Event;
};
