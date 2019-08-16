module.exports = (sequelize, DataTypes) => {
    const Purchase = sequelize.define('purchase', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            userId: {
                type: DataTypes.INTEGER,
                field: 'user_id'
            },
            eventId: {
                type: DataTypes.INTEGER,
                field: 'event_id'
            },
            ticketsCount: {
                type: DataTypes.INTEGER,
                field: 'tickets_count'
            }
        },
        {
            freezeTableName: true,
            timestamps: false,
            modelName: 'purchase'
        }
    );

    Purchase.associate = (models) => {
        Purchase.belongsTo(models.user, { as: 'user', foreignKey: 'userId', targetKey: 'id'});
        Purchase.belongsTo(models.event, { as: 'event', foreignKey: 'eventId', targetKey: 'id'});
    };

    return Purchase;
};
