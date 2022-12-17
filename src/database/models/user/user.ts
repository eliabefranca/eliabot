import { DataTypes, Model, Optional } from 'sequelize';
import { database } from '../..';

export interface UserAttributes {
  id: string;
  name: string;
  number: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at'> {}

export const UserModel = database.define<
  Model<UserAttributes, UserCreationAttributes>
>(
  'user',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'users',
    underscored: true,
    timestamps: true,
  }
);
