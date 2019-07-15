module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: DataTypes.STRING,
                unique: true
            },
            password: DataTypes.STRING,
            name: DataTypes.STRING,
            ssid: DataTypes.STRING
        },
        {
            freezeTableName: true,
            timestamps: false,
            modelName: 'user',
            defaultScope: {
                attributes: { exclude: ['password'] },
            }
        }
    );

    User.associate = (models) => {
        User.belongsToMany(models.role, { as: 'roles', through: 'user_role', foreignKey: 'userId' });
        User.hasMany(models.purchase, {as: 'purchases', foreignKey: 'userId', sourceKey: 'id'})
    };

    return User;
};
