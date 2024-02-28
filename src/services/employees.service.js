const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { db } = require("../models");
const { http } = require("winston");
const { userService } = require(".");
const { dataUri } = require("../config/multer");
const { uploader } = require("../config/cloudinary");

const createEmployee = async (id, employeeBody, file) => {
  const user = await db.users.findOne({ where: { id } });
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
  return employee;
};

const updateEmployee = async (updateBody, id) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  await db.users.update(updateBody, {
    where: { id },
  });
  if (updateBody.email && (await userService.isEmailTaken(updateBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const updateEmployee = db.employees.update(updateBody, {
    where: { userId: user.id },
  });
  return updateEmployee;
};

// const getEmployeeByUserId = async (id) => {
//   const employee = db.employees.findOne({ where: { id } });
//   if (!employee) {
//     throw new ApiError(httpStatus.NOT_FOUND, "employee not found");
//   }
//   return employee;
// };

const getAllEmployeeData = async (id) => {
  const user = await db.users.findOne({
    where: { id },
    include: { model: db.employees },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  return user;
};

/** 
Employment History Service
*/
const addEmpHistory = async (id, data) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const employee = await db.employees.findOne({
    where: {
      userId: user.id,
    },
  });
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "employee not found");
  }

  const empHistory = await db.empHistory.create({
    ...data,
    employeeId: employee.id,
  });

  return empHistory;
};

const getHistoryById = async (id) => {
  const history = await db.empHistory.findByPk(id);
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND, "history not found");
  }

  return history;
};

const getHistoryByAnEmployee = async (employeeId) => {
  const history = await db.empHistory.findAll({ where: { employeeId } });
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND, "No history not found");
  }

  return history;
};

const updateHistoryById = async (empHistoryId, data) => {
  const history = await db.empHistory.findOne({ where: { empHistoryId } });
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee History not found");
  }
  const updatedHistory = await history.update(data);
  return updatedHistory;
};

const deleteHistoryById = async (empHistoryId) => {
  const history = await db.empHistory.findOne({ where: { empHistoryId } });
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
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const employee = await db.employees.findOne({
    where: {
      userId: user.id,
    },
  });

  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "employee not found");
  }

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
  if (!certs) {
    throw new ApiError(httpStatus.NOT_FOUND, "certs not found");
  }

  return certs;
};

const getCertsByAnEmployee = async (employeeId) => {
  const certs = await db.empCerts.findAll({ where: { employeeId } });
  if (!certs) {
    throw new ApiError(httpStatus.NOT_FOUND, "certs not found");
  }

  return certs;
};

const updateCertById = async (certId, data) => {
  const cert = await db.empCerts.findOne({ where: { certId } });
  if (!cert) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Certificate or Training not found"
    );
  }
  const updatedCert = await cert.update(data);
  return updatedCert;
};

const deleteCertById = async (certId) => {
  const cert = await db.empCerts.findOne({ where: { certId } });
  if (!cert) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Certificate or Training not found"
    );
  }
  await db.empCerts.destroy({
    where: { id: certId },
  });
  return cert;
};

/** 
Employee Cv
*/

const addCv = async (id, data, file) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const employee = await db.employees.findOne({
    where: { userId: user.id },
  });
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "employee not found");
  }

  const fileUri = dataUri(file);

  const uploadCv = await uploader.upload(fileUri.content);

  const createCv = await db.cv.create({
    ...data,
    cv: uploadCv.secure_url,
    employeeId: employee.dataValues.id,
  });

  return createCv;
};

const getCvById = async (id) => {
  const cv = await db.cv.findByPk(id);
  if (!cv) {
    throw new ApiError(httpStatus.NOT_FOUND, "cv not found");
  }
  return cv;
};

const getCvByAnEmployee = async (employeeId) => {
  const cv = await db.cv.findAll({ where: { employeeId } });
  if (!cv) {
    throw new ApiError(httpStatus.NOT_FOUND, "cv not found");
  }
  return cv;
};

const deleteCvById = async (cvId) => {
  const cv = await db.cv.findOne({ where: { cvId } });
  if (!cv) {
    throw new ApiError(httpStatus.NOT_FOUND, "cv not found");
  }
  await db.cv.destroy({
    where: {
      id: cvId,
    },
  });
  return cv;
};

/**
 * Employee Right to work
 */

const addRtw = async (id, data, file) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const employee = await db.employees.findOne({
    where: {
      userId: user.id,
    },
  });

  const fileUri = dataUri(file);

  const uploadRtw = await uploader.upload(fileUri.content);

  const createRtw = await db.rightToWork.create({
    ...data,
    rightToWork: uploadRtw.secure_url,
    employeeId: employee.dataValues.id,
  });

  return createRtw;
};

const getRtwById = async (id) => {
  const rtw = await db.rightToWork.findByPk(id);
  if (!rtw) {
    throw new ApiError(httpStatus.NOT_FOUND, "right to work not found");
  }

  return rtw;
};

const getRtwByAnEmployee = async (employeeId) => {
  const rtw = await db.rightToWork.findAll({ where: { employeeId } });
  if (!rtw) {
    throw new ApiError(httpStatus.NOT_FOUND, "No right to work not found");
  }
  return rtw;
};

const deleteRtwById = async (rtwId) => {
  const rtw = await db.rightToWork.findOne({ where: { rtwId } });
  if (!rtw) {
    throw new ApiError(httpStatus.NOT_FOUND, "Right to work not found");
  }
  await db.rtw.destroy({
    where: {
      id: rtwId,
    },
  });
  return rtw;
};

/** 
Employee Referee Service
*/

const addReferee = async (id, data) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const employee = await db.employees.findOne({
    where: {
      userId: user.id,
    },
  });
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "employee not found");
  }

  const referee = await db.referees.create({
    ...data,
    employeeId: employee.id,
  });

  return referee;
};

const getRefereeById = async (id) => {
  const referee = await db.referees.findByPk(id);
  if (!referee) {
    throw new ApiError(httpStatus.NOT_FOUND, "referee not found");
  }

  return referee;
};

const getRefereeByAnEmployee = async (employeeId) => {
  const referee = await db.referees.findAll({ where: { employeeId } });
  if (!referee) {
    throw new ApiError(httpStatus.NOT_FOUND, "No referee not found");
  }
  return referee;
};

const updateRefereeById = async (refereeId, data) => {
  const referee = await db.referees.findOne({ where: { refereeId } });
  if (!referee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Referee not found");
  }
  const updatedReferee = await referee.update(data);
  return updatedReferee;
};

const deleteRefereeById = async (refereeId) => {
  const referee = await db.referees.findOne({ where: { refereeId } });
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

/** 
Get All New Employees by app admin
*/

const getAllNewEmployees = async (id, filter, options) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const defaultOptions = {
    limit: parseInt(options.limit) || 10,
    offset:
      ((parseInt(options.page) || 1) - 1) * (parseInt(options.limit) || 10),
    order: [["createdAt", "DESC"]],
  };

  const combinedOptions = {
    ...defaultOptions,
    ...options,
  };

  if (filter.status === "new") {
    combinedOptions.limit = 20;

    const employees = await db.users.findAndCountAll({
      include: {
        model: db.employees,
        as: "employee",
      },
      ...combinedOptions,
    });
    if (!employees) {
      throw new ApiError(httpStatus.NOT_FOUND, "employees not found");
    }
  
    return employees;
  }
};

const adminGetAllEmployeeData = async (id, employeeId) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  // Fetch employee data
  const employee = await db.employees.findOne({
    where: { id: employeeId },
    include: [
      {
        model: db.users,
      },
      db.cv,
      db.referees,
      db.rightToWork,
      db.empHistory,
    ],
  });

  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");
  }

  return employee;
};

const getAllEmployees = async (id) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const employees = await db.employees.findAndCountAll({
    include: {
      model: db.users,
    },
  });

  if (!employees) {
    throw new ApiError(httpStatus.NOT_FOUND, "employees not found");
  }

  return employees;
};

const getApprovedEmployees = async (id) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const employees = await db.employees.findAll({
    where: {
      verification: "verified",
    },
    include: { model: db.users },
  });

  if (!employees) {
    throw new ApiError(httpStatus.NOT_FOUND, "No approved employees not found");
  }

  return employees;
};

const getAnApprovedEmployee = async (id, employeeId) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const employees = await db.employees.findOne({
    where: {
      id: employeeId,
      verification: "verified",
    },
    include: { model: db.users },
  });
  if (!employees) {
    throw new ApiError(httpStatus.NOT_FOUND, "No approved employees not found");
  }

  return employees;
};
const deleteAnApprovedEmployee = async (id, employeeId) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const employees = await db.employees.destroy({
    where: {
      id: employeeId,
      verification: "verified",
    },
    include: { model: db.users },
  });
  if (!employees) {
    throw new ApiError(httpStatus.NOT_FOUND, "No approved employees not found, Can't delete");
  }

  return employees;
};

module.exports = {
  createEmployee,
  updateEmployee,
  getAllEmployeeData,
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
  deleteRefereeById,
  addCv,
  getCvById,
  getCvByAnEmployee,
  deleteCvById,
  addRtw,
  getRtwByAnEmployee,
  getRtwById,
  deleteRtwById,
  getAllNewEmployees,
  adminGetAllEmployeeData,
  getAllEmployees,
  getApprovedEmployees,
  getAnApprovedEmployee,
  deleteAnApprovedEmployee,
};
