const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('record', {
        sender: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true,
        },
        get: {
            type: DataTypes.STRING(100),
            primaryKey: true,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER.UNSIGNED.ZEROFILL,
            allowNull: false
        }
    },{
        tableName: 'record',
        timestamps: false
    })
}