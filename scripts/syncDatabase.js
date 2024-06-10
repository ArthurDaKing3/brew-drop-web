import sequelize from '../models/index.js';
import Product from '../models/product.js'; // Importa el modelo Product

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // Usa { force: true } solo en desarrollo
    console.log('Database synced!');

    // Lista de productos base
    const products = [
      {
        name: 'Latte',
        price: 60,
        category: ['Espresso', 'Caliente'],
        image: 'latte.png',
      },
      {
        name: 'Cappuccino',
        price: 70,
        category: ['Espresso', 'Caliente'],
        image: 'latte.png',
      },
      {
        name: 'Americano',
        price: 50,
        category: ['Espresso', 'Caliente'],
        image: 'latte.png',
      },
      // Agrega más productos según sea necesario
    ];

    // Crear registros en la base de datos
    await Product.bulkCreate(products);
    console.log('Base products added!');

  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

syncDatabase();
