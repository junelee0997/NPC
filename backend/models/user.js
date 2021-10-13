const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        id: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        coin: {
            type: DataTypes.FLOAT.UNSIGNED.ZEROFILL,
            allowNull: false
        }
    },{
        tableName: 'user',
        timestamps: false
    })
}