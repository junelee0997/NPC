const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('admin', {
        id: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    },{
        tableName: 'admin',
        timestamps: false
    })
}