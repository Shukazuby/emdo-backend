const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { planService } = require("../services");
const ApiError = require("../utils/ApiError");

const plans = catchAsync(async (req, res) => {
  const plan = await planService.plans(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(plan);
});

const subscribe = catchAsync(async (req, res) => {
  const { plan } = req.query;
  const subscribe = await planService.subscribe(req.user.id, plan);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Just Subscribed", subscribe });
});

const verifyPayment = catchAsync(async (req, res) => {
  const verify = await planService.verifyPayment(req.query.sessionId);
  res
    .status(httpStatus.OK)
    .send({ message: "verified", verify });
});

const getPayments = catchAsync(async (req, res) => {
  const payments = await planService.getPayments(req.user.id);
  res.status(httpStatus.OK).send( payments);
});

const getPaymentsByEmployeeId = catchAsync(async (req, res) => {
  const payments = await planService.getPaymentsByEmployeeId(req.user.id, req.params.employeeId);
  res.status(httpStatus.OK).send( payments);
});

const getPaymentById = catchAsync(async (req, res) => {
  const payments = await planService.getPaymentsById(req.user.id, req.params.paymentId);
  res.status(httpStatus.OK).send( payments);
});

const getAPaymentByEmployee = catchAsync(async (req, res) => {
  const payments = await planService.getAPaymentByEmployee(req.user.id, req.params.paymentId);
  res.status(httpStatus.OK).send( payments);
});

const getAllPaymentByEmployee = catchAsync(async (req, res) => {
  const payments = await planService.getAllPaymentsByEmployee(req.user.id);
  res.status(httpStatus.OK).send( payments);
});


module.exports = {
  subscribe,
  plans,
  verifyPayment,
  getPayments,
  getPaymentsByEmployeeId,
  getPaymentById,
  getAPaymentByEmployee,
  getAllPaymentByEmployee
};
