const Sequelize = require("sequelize");
const { sequelize } = require("../config/config");
const logger = require("../config/logger");

const sequelizeInstance = new Sequelize(sequelize.url);
const db = {};

sequelizeInstance
  .authenticate()
  .then(() => logger.info("DB connected"))
  .catch((err) => {
    // console.log(err);
    logger.error(err);
  });

db.sequelize = sequelizeInstance;
db.Sequelize = Sequelize;

db.users = require("./user.model")(sequelizeInstance, Sequelize);
db.employees = require("./employee.model")(sequelizeInstance, Sequelize);
db.employers = require("./employer.model")(sequelizeInstance, Sequelize);
db.tokens = require("./token.model")(sequelizeInstance, Sequelize);
db.jobs = require("./job.model")(sequelizeInstance, Sequelize);
db.teamManagers = require("./teamManager.model")(sequelizeInstance, Sequelize);
db.uploads = require("./upload.model")(sequelizeInstance, Sequelize);
db.empCerts = require("./empCert.model")(sequelizeInstance, Sequelize);
db.empHistory = require("./empHistory.model")(sequelizeInstance, Sequelize);
db.referees = require("./empReferee.model")(sequelizeInstance, Sequelize);
db.rightToWork = require("./rightToWork.model")(sequelizeInstance, Sequelize);
db.cv = require("./cv.model")(sequelizeInstance, Sequelize);
db.jobApply = require("./jobApply.model")(sequelizeInstance, Sequelize);

// Relationships For Models

// One-to-one Relationship

db.users.hasOne(db.employers);
db.employers.belongsTo(db.users);

db.users.hasOne(db.employees);
db.employees.belongsTo(db.users);

// One-to-Many Relationship
db.employers.hasMany(db.jobs);
db.jobs.belongsTo(db.employers);

db.employers.hasMany(db.teamManagers);
db.teamManagers.belongsTo(db.employers);

db.users.hasMany(db.teamManagers);
db.teamManagers.belongsTo(db.users);

db.users.hasMany(db.uploads);
db.uploads.belongsTo(db.users);

db.employees.hasMany(db.empCerts);
db.empCerts.belongsTo(db.employees);

db.employees.hasMany(db.empHistory);
db.empHistory.belongsTo(db.employees);

db.employees.hasMany(db.referees);
db.referees.belongsTo(db.employees);

db.employees.hasMany(db.cv);
db.cv.belongsTo(db.employees);

db.employees.hasMany(db.rightToWork);
db.rightToWork.belongsTo(db.employees);

db.users.hasMany(db.jobApply);
db.jobApply.belongsTo(db.users);

db.jobs.hasMany(db.jobApply);
db.jobApply.belongsTo(db.jobs);

// db.employees.belongsToMany(db.jobs, { through: db.jobApply, as: 'appliedJobs' });

// Many-to-many Relationship

module.exports = {
  db,
};
