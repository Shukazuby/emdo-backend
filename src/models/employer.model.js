module.exports = (sequelize, dataType) => {
  const employer = sequelize.define('employer', {
    companyName: {
      type: dataType.STRING,
      trim: true,
    },
  
    branchName: {
      type: dataType.STRING,
      trim: true,
    },
    companyDescription: {
      type: dataType.STRING,
      trim: true,
    },
    noOfEmployees: {
      type: dataType.INTEGER,
      trim: true,
    },
    typeOfEmployer: {
      type: dataType.STRING,
      trim: true,
    },
    typeOfJob: {
      type: dataType.STRING,
      trim: true,
    },
    website: {
      type: dataType.STRING,
      trim: true,
    },
    
    logo: {
      type: dataType.STRING,
      trim: true,
    },

// Company Rep Details

firstName: {
  type: dataType.STRING,
  trim: true,
},
lastName: {
  type: dataType.STRING,
  trim: true,
},
role: {
  type: dataType.STRING,
  trim: true,
},
personalEmail: {
  type: dataType.STRING,
  trim: true,
},






  });

  return employer;
};