module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define('user_role', {},
        {
            freezeTableName: true,
            timestamps: false,
        }
    );
    return UserRole;
};
