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
db.reviews = require("./review.model")(sequelizeInstance, Sequelize);
db.plans = require("./plan.model")(sequelizeInstance, Sequelize);
db.payment = require("./payment.model")(sequelizeInstance, Sequelize);
db.subscription = require("./subscription.model")(sequelizeInstance, Sequelize);
db.messages = require("./message.model")(sequelizeInstance, Sequelize);
db.notifications = require("./notification.model")(sequelizeInstance, Sequelize);
db.admins = require("./admin.model")(sequelizeInstance, Sequelize);
db.newAdmins = require("./newAdmin.model")(sequelizeInstance, Sequelize);
db.bookmarks = require("./bookmark.model")(sequelizeInstance, Sequelize);

// Relationships For Models

// One-to-one Relationship

db.users.hasOne(db.employers);
db.employers.belongsTo(db.users);

db.users.hasOne(db.employees);
db.employees.belongsTo(db.users);

db.users.hasOne(db.admins);
db.admins.belongsTo(db.users);

db.users.hasOne(db.newAdmins);
db.newAdmins.belongsTo(db.users);

// One-to-Many Relationship
db.admins.hasMany(db.newAdmins);
db.newAdmins.belongsTo(db.admins);


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

db.employees.belongsToMany(db.jobs,{ through: db.jobApply, as: 'appliedJobs'} )
db.jobs.belongsToMany(db.employees,{through: db.jobApply, as:'application'})

db.employees.belongsToMany(db.jobs, { through: db.bookmarks, as: 'bookmarkedJobs' });
db.jobs.belongsToMany(db.employees, { through: db.bookmarks, as: 'bookmarkedBy' });

db.employees.hasMany(db.jobApply);
db.jobApply.belongsTo(db.employees);

db.jobs.hasMany(db.jobApply);
db.jobApply.belongsTo(db.jobs);

db.employees.hasMany(db.reviews);
db.reviews.belongsTo(db.employees);

db.employers.hasMany(db.reviews);
db.reviews.belongsTo(db.employers);

db.employees.hasMany(db.payment);
db.payment.belongsTo(db.employees);

db.employees.hasMany(db.subscription);
db.subscription.belongsTo(db.employees);

db.plans.hasMany(db.subscription)
db.subscription.belongsTo(db.plans)

db.users.hasMany(db.messages)
db.messages.belongsTo(db.users)

db.users.hasMany(db.notifications)
db.notifications.belongsTo(db.users)

db.employees.hasMany(db.bookmarks);
db.bookmarks.belongsTo(db.employees);

db.jobs.hasMany(db.bookmarks);
db.bookmarks.belongsTo(db.jobs);

// // db.employees.belongsToMany(db.jobs, { through: db.jobApply, as: 'appliedJobs' });

// Many-to-many Relationship

module.exports = {
  db,
};
