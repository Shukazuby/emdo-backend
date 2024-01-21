const Sequelize = require('sequelize');
const { sequelize } = require('../config/config');
const logger = require('../config/logger');

const sequelizeInstance = new Sequelize(sequelize.url);
const db = {};

sequelizeInstance
  .authenticate()
  .then(() => logger.info('DB connected'))
  .catch((err) => {
    // console.log(err);
    logger.error(err);
  });

db.sequelize = sequelizeInstance;
db.Sequelize = Sequelize;

db.users = require('./user.model')(sequelizeInstance, Sequelize);
db.employees = require('./employee.model')(sequelizeInstance, Sequelize);
db.employers = require('./employer.model')(sequelizeInstance, Sequelize);
db.tokens = require('./token.model')(sequelizeInstance, Sequelize);

// Relationships For Models

// One-to-one Relationship

db.users.hasOne(db.employers);
db.employers.belongsTo(db.users);
db.users.hasOne(db.employees);
db.employees.belongsTo(db.users);

// One-to-Many Relationship


// Many-to-many Relationship


module.exports = {
  db,
};
