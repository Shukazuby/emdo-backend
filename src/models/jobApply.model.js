module.exports = (sequelize, dataType) => {
  const jobApply = sequelize.define('jobApply', {
    id:{
      type: dataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    status:{
      type: dataType.ENUM('applied', 'approved','declined', 'confirmed', 'rejected' ),
      defaultValue: 'applied'
    }
  });

  return jobApply;
};
