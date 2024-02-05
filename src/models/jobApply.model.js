module.exports = (sequelize, dataType) => {
  const jobApply = sequelize.define('jobApply', {
    status:{
      type: dataType.ENUM('applied', 'approved','declined', 'confirmed', 'rejected' ),
      defaultValue: 'applied'
    }
  });

  return jobApply;
};
