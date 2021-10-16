const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('product', {
        productid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        price: {
            type: DataTypes.INTEGER.UNSIGNED.ZEROFILL,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    },{
        tableName: 'product',
        timestamps: false
    })
}