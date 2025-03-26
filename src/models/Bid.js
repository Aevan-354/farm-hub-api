import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Land from './Land.js';
import User from './User.js';

const Bid = sequelize.define('Bid', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 1, // Minimum bid amount
        }
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    landId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Land,
            key: 'id'
        }
    }
});

export default Bid;
