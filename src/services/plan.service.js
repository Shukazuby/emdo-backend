const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { db } = require("../models");
const { userService } = require("./user.service");
const config = require("../config/config");
const stripe = require("stripe")(config.stripe.stripeKey);
const moment = require('moment')
const plans = async (planBody) => {
  const plans = await db.plans.create(planBody);
  return plans;
};

// const [basicMonth, basicYear,standardMonth, standardYear, ]= ['price_1OjG5qGNmK4WG3L77CSJOMPC','price_1OjG4AGNmK4WG3L7aH49kRYt', 'price_1OjG5FGNmK4WG3L7bmiOrkU7', 'price_1OjG6NGNmK4WG3L7gFkHxool' ]

const subscribe = async (id, planBody) => {
  const employee = await db.employees.findOne({
    where: {
      userId: id,
    },
  });
  const plan = await db.plans.findOne({
    where: {
      id: planBody,
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: plan.priceId,
        quantity: 1,
      },
    ],
    metadata: { planId: plan.id },
    mode: "subscription",
    success_url: `https://emdo.com/success`,
    cancel_url: `https://emdo.com/cancel`,
  });

  const payment = await db.payment.create({
    employeeId: employee.id,
    sessionId: session.id,
    amount: session.amount_total,
    status: "pending",
  });
  return { session };
};

const verifyPayment = async (sessionId) => {
  // Retrieve payment from the database
  const payment = await db.payment.findOne({
    where: { sessionId },
  });

  // Function to calculate subscription dates based on billing cycle
  const calculateSubscriptionDates = (startDate, billingCycle) => {
    switch (billingCycle) {
      case "monthly":
        return {
          startDate: moment(startDate),
          endDate: moment(startDate).add(1, "month").startOf("day"),
        };
      case "yearly":
        return {
          startDate: moment(startDate),
          endDate: moment(startDate).add(1, "year").startOf("day"),
        };
      default:
        throw new Error(`Invalid billing cycle: ${billingCycle}`);
    }
  };

  // Retrieve session from Stripe
  const session = await stripe.checkout.sessions.retrieve(payment.sessionId);

  // Retrieve plan from the database based on metadata
  const plan = await db.plans.findOne({
    where: { id: session.metadata.planId },
  });

  // Calculate subscription dates based on current date and plan's billing cycle
  const currentDate = new Date();
  const dates = calculateSubscriptionDates(currentDate, plan.billingCycle);

  // Update payment status based on session payment status
  let statusUpdate;
  if (session.payment_status === "paid") {
    statusUpdate = { status: "successful" };
  } else {
    statusUpdate = { status: "failed" };
  }

  // Update payment status in the database
  await payment.update(statusUpdate);

  // If payment is successful, create subscription record in the database
  if (session.payment_status === "paid") {
    const subscribed = await db.subscription.create({
      planId: plan.id,
      employeeId: payment.employeeId,
      startDate: dates.startDate,
      endDate: dates.endDate,
      status:'active'
    });
    return subscribed;
  } else {
    return "Payment failed";
  }
};


module.exports = {
  plans,
  subscribe,
  verifyPayment,
};
