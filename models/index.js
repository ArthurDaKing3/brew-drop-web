import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'path/to/your/database.sqlite' // Especifica la ruta de tu base de datos
});

export default sequelize;
