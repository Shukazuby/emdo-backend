const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { db } = require("../models");
const { http } = require("winston");
const { userService } = require(".");
const { dataUri } = require("../config/multer");
const { uploader } = require("../config/cloudinary");

/**
 * creates a subject
 * @param {Object} employeeBody
 * @returns {Promise<Object>}
 */
const createEmployee = async (id, employeeBody,file) => {
  const user = await db.users.findOne({
    where: {
      id,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const fileUri = dataUri(file);
    
  const uploadFile = await uploader.upload(fileUri.content);
  
  const employee = db.employees.create({
    ...employeeBody,
    cv: uploadFile.secure_url, 
    rightToWork: uploadFile.secure_url, 
    userId: user.id,
  });

  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "employer not found");
  }
  return employee;
};

const updateEmployee = async (updateBody, id) => {
  const user = await db.users.findOne({
    where: {
      id,
    },
  });

  await db.users.update(updateBody, {
    where: {
      id,
    },
  });
  if (updateBody.email && (await userService.isEmailTaken(updateBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const updateEmployee = db.employees.update(updateBody, {
    where: {
      userId: user.id,
    },
  });
  return updateEmployee;
};

const getEmployeeByUserId = async (id) => {
  const employee = db.employees.findOne({ where: { id } });
  if(!employee){
    throw new ApiError(httpStatus.NOT_FOUND, 'employer not found')
  }
  return employee;
};

const getAllEmployeeData = async (id) => {
  const employees = db.users.findByPk(id, {
    include: [
      {
        model: db.employees,
        as: 'employee',
      },
    ],
  });

  if(!employees){
    throw new ApiError(httpStatus.NOT_FOUND, 'employer not found')
  }

  return employees;
};

/** 
Employment History Service
*/
const addEmpHistory = async (id, data) => {
  const user = await db.users.findOne({
    where:{
      id
    }
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const employee = await db.employees.findOne({ 
    where: { 
      userId: user.dataValues.id 
    } 
  });
  const empHistory = await db.empHistory.create({
    ...data,
    employeeId: employee.id,
  });

  return empHistory;
};

const getHistoryById = async (id) => {
  const history = await db.empHistory.findByPk(id);
  return history;
};

const getHistoryByAnEmployee = async (employeeId) => {
  const history = await db.empHistory.findAll({ where: { employeeId } });
  return history;
};

const updateHistoryById = async (empHistoryId, data) => {
  const history = await db.empHistory.findOne({ where: {empHistoryId}});
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee History not found");
  }
  const updatedHistory = await history.update(data);
  return updatedHistory;
};

const deleteHistoryById = async (empHistoryId) => {
  const history = await db.empHistory.findOne({ where: {empHistoryId}});
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee History not found");
  }
  await db.empHistory.destroy({
    where: {
      id: empHistoryId,
    },
  });
  return history;
};

/** 
Employee Training Certificate Service
*/

const addEmpCert = async (id, data, file) => {
  const user = await db.users.findOne({
    where:{
      id
    }
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const employee = await db.employees.findOne({ 
    where: { 
      userId: user.dataValues.id 
    } 
  });

  const fileUri = dataUri(file);
    
  const uploadCertFile = await uploader.upload(fileUri.content);
  
  const empCert = await db.empCerts.create({
    ...data,
    certFile: uploadCertFile.secure_url, 
    employeeId: employee.dataValues.id,
  });

  return empCert;
};

const getCertsById = async (id) => {
  const certs = await db.empCerts.findByPk(id);
  return certs;
};

const getCertsByAnEmployee = async (employeeId) => {
  const certs = await db.empCerts.findAll({ where: { employeeId } });
  return certs;
};

const updateCertById = async (certId, data) => {
  const cert = await db.empCerts.findOne({ where: {certId}});
  if (!cert) {
    throw new ApiError(httpStatus.NOT_FOUND, "Certificate or Training not found");
  }
  const updatedCert = await cert.update(data);
  return updatedCert;
};

const deleteCertById = async (certId) => {
  const cert = await db.empCerts.findOne({ where: {certId}});
  if (!cert) {
    throw new ApiError(httpStatus.NOT_FOUND, "Certificate or Training not found");
  }
  await db.empCerts.destroy({
    where: {
      id: certId,
    },
  });
  return cert;
};


/** 
Employee Referee Service
*/

const addReferee = async (id, data) => {
  const user = await db.users.findOne({
    where:{
      id
    }
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const employee = await db.employees.findOne({ 
    where: { 
      userId: user.dataValues.id 
    } 
  });

  const referee = await db.referees.create({
    ...data,
    employeeId: employee.id,
  });

  return referee;
};

const getRefereeById = async (id) => {
  const referee = await db.referees.findByPk(id);
  return referee;
};

const getRefereeByAnEmployee = async (employeeId) => {
  const referee = await db.referees.findAll({ where: { employeeId } });
  return referee;
};

const updateRefereeById = async (refereeId, data) => {
  const referee = await db.referees.findOne({ where: {refereeId}});
  if (!referee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Referee not found");
  }
  const updatedReferee = await referee.update(data);
  return updatedReferee;
};

const deleteRefereeById = async (refereeId) => {
  const referee = await db.referees.findOne({ where: {refereeId}});
  if (!referee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Referee not found");
  }
  await db.referees.destroy({
    where: {
      id: refereeId,
    },
  });
  return referee;
};


module.exports = {
  createEmployee,
  updateEmployee,
  getAllEmployeeData,
  getEmployeeByUserId,
  addEmpHistory,
  getHistoryById,
  getHistoryByAnEmployee,
  updateHistoryById,
  deleteHistoryById,
  addEmpCert,
  getCertsByAnEmployee,
  getCertsById,
  updateCertById,
  deleteCertById,
  addReferee,
  getRefereeByAnEmployee,
  getRefereeById,
  updateRefereeById,
  deleteRefereeById
};
