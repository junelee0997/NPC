const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('picture', {
        pictureid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        userid: {
            type: DataTypes.STRING(100),
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        adress: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    },{
        tableName: 'picture',
        timestamps: false
    })
}