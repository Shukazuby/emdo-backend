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

cRepFirstName: {
  type: dataType.STRING,
  trim: true,
},
cRepLastName: {
  type: dataType.STRING,
  trim: true,
},
cRepRole: {
  type: dataType.STRING,
  trim: true,
},
cRepPersonalEmail: {
  type: dataType.STRING,
  trim: true,
},
accessLevel: {
  type: dataType.ENUM('administrator', 'standard'),
  trim: true,
},


});

  return employer;
};