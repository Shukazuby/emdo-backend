const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
// const { generateOtp } = require("../utils/helper");
const { employeeService } = require("../services");

const updateEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.updateEmployee(
    req.body,
    req.params.id
  );
  res.status(httpStatus.OK).send(employee);
});

const getEmployeeByUserId = catchAsync(async (req, res) => {
  const employeeById = await employeeService.getAllEmployeeData(req.params.id);
  res.status(httpStatus.OK).send(employeeById);
});

/**
 * Employer History Controller
 */

const addEmpHistory = catchAsync(async (req, res) => {
  const { id } = req.user;
  const history = await employeeService.addEmpHistory(id, req.body);
  res.status(httpStatus.CREATED).send(history);
});

const getEmpHistory = catchAsync(async (req, res) => {
  const { empHistoryId } = req.params;
  const history = await employeeService.getHistoryById(empHistoryId);
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employment history not found");
  }
  res.status(httpStatus.OK).send(history);
});

const getHistoryByAnEmployee = catchAsync(async (req, res) => {
  const { id } = req.user;
  const employee = await employeeService.getEmployeeByUserId(id);
  const history = await employeeService.getHistoryByAnEmployee(employee.id);
  res.send(history);
});

const updateHistory = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { empHistoryId } = req.params;
  const employee = await employeeService.getEmployeeByUserId(id);
  const history = await employeeService.getHistoryById(empHistoryId);
  if (employee.id !== history.employeeId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  const updatedHistory = await employeeService.updateHistoryById(
    empHistoryId,
    req.body
  );
  res.send(updatedHistory);
});

const deleteHistory = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { empHistoryId } = req.params;

  const employee = await employeeService.getEmployeeByUserId(id);
  const history = await employeeService.getHistoryById(empHistoryId);

  if (employee.id !== history.employeeId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  await employeeService.deleteHistoryById(empHistoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Employee Certificate and Training Controller
 */

const addEmpCert = catchAsync(async (req, res) => {
  const { id } = req.user;
  const cert = await employeeService.addEmpCert(id, req.body, req.file);
  res.status(httpStatus.CREATED).send(cert);
});

const getCert = catchAsync(async (req, res) => {
  const { certId } = req.params;
  const cert = await employeeService.getCertsById(certId);
  if (!cert) {
    throw new ApiError(httpStatus.NOT_FOUND, "Certification not found");
  }
  res.status(httpStatus.OK).send(cert);
});

const getCertByAnEmployee = catchAsync(async (req, res) => {
  const { id } = req.user;
  const employee = await employeeService.getEmployeeByUserId(id);
  const cert = await employeeService.getCertsByAnEmployee(employee.id);
  res.send(cert);
});

const updateCert = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { certId } = req.params;
  const employee = await employeeService.getEmployeeByUserId(id);
  const cert = await employeeService.getCertsById(certId);
  if (employee.id !== cert.employeeId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  const updatedCert = await employeeService.updateCertById(certId, req.body);
  res.send(updatedCert);
});

const deleteCert = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { certId } = req.params;

  const employee = await employeeService.getEmployeeByUserId(id);
  const cert = await employeeService.getCertsById(certId);

  if (employee.id !== cert.employeeId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  await employeeService.deleteCertById(certId);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Employee Cv Controller
 */

const addCv = catchAsync(async (req, res) => {
  const { id } = req.user;
  const cv = await employeeService.addCv(id, req.body, req.file);
  res.status(httpStatus.CREATED).send(cv);
});

const getCv = catchAsync(async (req, res) => {
  const { cvId } = req.params;
  const cv = await employeeService.getCvById(cvId);
  if (!cv) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cv not found");
  }
  res.status(httpStatus.OK).send(cv);
});

const getCvByAnEmployee = catchAsync(async (req, res) => {
  const { id } = req.user;
  const employee = await employeeService.getEmployeeByUserId(id);
  const cv = await employeeService.getCvByAnEmployee(employee.id);
  res.send(cv);
});

const deleteCv = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { cvId } = req.params;

  const employee = await employeeService.getEmployeeByUserId(id);
  const cv = await employeeService.getCvById(cvId);

  if (employee.id !== cv.employeeId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  await employeeService.deleteCvById(cvId);
  res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Employee Right to Work Controller
 */


const addRtw = catchAsync(async (req, res) => {
  const { id } = req.user;
  const rtw = await employeeService.addRtw(id, req.body, req.file);
  res.status(httpStatus.CREATED).send(rtw);
});

const getRtw = catchAsync(async (req, res) => {
  const { rtwId } = req.params;
  const rtw = await employeeService.getRtwById(rtwId);
  if (!rtw) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Right to work document not found"
    );
  }
  res.status(httpStatus.OK).send(rtw);
});

const getRtwByAnEmployee = catchAsync(async (req, res) => {
  const { id } = req.user;
  const employee = await employeeService.getEmployeeByUserId(id);
  const rtw = await employeeService.getRtwByAnEmployee(employee.id);
  res.send(rtw);
});

const deleteRtw = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { rtwId } = req.params;

  const employee = await employeeService.getEmployeeByUserId(id);
  const rtw = await employeeService.getRtwById(rtwId);

  if (employee.id !== rtw.employeeId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  await employeeService.deleteRtwById(rtwId);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Referee Controller
 */

const addReferee = catchAsync(async (req, res) => {
  const { id } = req.user;
  const referee = await employeeService.addReferee(id, req.body);
  res.status(httpStatus.CREATED).send(referee);
});

const getReferee = catchAsync(async (req, res) => {
  const { refereeId } = req.params;
  const referee = await employeeService.getRefereeById(refereeId);
  if (!referee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employment history not found");
  }
  res.status(httpStatus.OK).send(referee);
});

const getRefereeByAnEmployee = catchAsync(async (req, res) => {
  const { id } = req.user;
  const employee = await employeeService.getEmployeeByUserId(id);
  const referee = await employeeService.getRefereeByAnEmployee(employee.id);
  res.send(referee);
});

const updateReferee = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { refereeId } = req.params;
  const employee = await employeeService.getEmployeeByUserId(id);
  const referee = await employeeService.getRefereeById(refereeId);
  if (employee.id !== referee.employeeId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  const updatedReferee = await employeeService.updateRefereeById(
    refereeId,
    req.body
  );
  res.send(updatedReferee);
});

const deleteReferee = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { refereeId } = req.params;

  const employee = await employeeService.getEmployeeByUserId(id);
  const referee = await employeeService.getRefereeById(refereeId);

  if (employee.id !== referee.employeeId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  await employeeService.deleteRefereeById(refereeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  updateEmployee,
  getEmployeeByUserId,
  addEmpHistory,
  getEmpHistory,
  getHistoryByAnEmployee,
  updateHistory,
  deleteHistory,
  addEmpCert,
  getCert,
  getCertByAnEmployee,
  updateCert,
  deleteCert,
  addReferee,
  getCert,
  getRefereeByAnEmployee,
  updateReferee,
  deleteReferee,
  getReferee,
  addCv,
  getCv,
  getCvByAnEmployee,
  deleteCv,
  addRtw,
  getRtw,
  getRtwByAnEmployee,
  deleteRtw,
};
