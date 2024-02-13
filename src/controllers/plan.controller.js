const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { planService } = require("../services");
const ApiError = require("../utils/ApiError");

const plans = catchAsync(async (req, res) => {
  const plan = await planService.plans(req.body);
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


module.exports = {
  subscribe,
  plans,
  verifyPayment
};
