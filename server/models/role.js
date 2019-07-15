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
            modelName: 'role'
        }
    );

    Role.associate = (models) => {
        Role.belongsToMany(models.user, { as: 'users', through: 'user_role', foreignKey: 'roleId' });
    };

    return Role;
};
