const allRoles = {
    admin: ['getUsers', 'manageUsers', 'verifyUsers', 'getAllJobs', 'getEmployeeData', 'getNewEmployee', 'getAllReviews', 'getEmployeeReviews', 'getEmployerData', 'getAllEmployers', 'getAllEmployees', 'getPayments', 'getPaymentsById', 'getPaymentsByEmployeeId', 'verifyEmployee', 'verifyEmployer', 'getApprovedEmployers', 'getApprovedEmployees', 'addPlan'],

    employer: ['postJobs', 'manageJobs', 'getEmployeeData', 'getAllJobs', 'getJobData', 'addReview', 'jobApproval', 'appliedJob'],
    employee: ['getPayment', 'subscribe', 'getReviews', 'applyJob', 'jobApproval'],
    teamManager: ['administrator', 'standard']
  };
  
  const roles = Object.keys(allRoles);
  const roleRights = new Map(Object.entries(allRoles));
  
  module.exports = {
    roles,
    roleRights,
  };
  