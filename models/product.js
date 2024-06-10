import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Product = sequelize.define('Product', {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING, // Almacenar como cadena de texto
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('category');
      return rawValue ? rawValue.split(',') : [];
    },
    set(value) {
      this.setDataValue('category', value.join(','));
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Product;
