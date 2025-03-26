const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // Ensure db.js exists and exports a Sequelize instance

const Binding = sequelize.define("Binding", {
    landId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tenantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
    }
});

module.exports = Binding;
