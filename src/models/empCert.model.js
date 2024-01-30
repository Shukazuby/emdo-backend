module.exports = (sequelize, dataType) => {
  const empCert = sequelize.define('empCert', {
    certTitle: {
      type: dataType.STRING,
      trim: true,
    },
    issuingOrg: {
      type: dataType.STRING,
      trim: true,
    },
    issueDate: {
      type: dataType.DATE,
      trim: true,
    },
    expirationDate: {
      type: dataType.DATE,
      trim: true,
    },
    credentialId: {
      type: dataType.STRING,
      trim: true,
    },
    credentialUrl: {
      type: dataType.STRING,
      trim: true,
    },
    certFile:{
      type: dataType.STRING,
      trim: true,
    }

  });

  return empCert;
};
