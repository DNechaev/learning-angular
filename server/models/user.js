module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            name: DataTypes.STRING
        },
        {
            freezeTableName: true,
            timestamps: false,
        }
    );

    User.associate = (models) => {
        User.belongsToMany(models.role, { as: 'Roles', through: 'user_role', foreignKey: 'userId' });
    };

    return User;
}
