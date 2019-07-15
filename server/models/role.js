module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('role', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: DataTypes.STRING
        },
        {
            freezeTableName: true,
            timestamps: false,
        }
    );

    Role.associate = (models) => {
        Role.belongsToMany(models.user, { as: 'Users', through: 'user_role', foreignKey: 'roleId' });
    };

    return Role;
}
