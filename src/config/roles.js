const allRoles = {
    admin: ['getUsers', 'manageUsers', 'verifyUsers'],
    employer: ['postJobs', 'manageJobs'],
    employee: [],
    teamManager: ['administrator', 'standard']
  };
  
  const roles = Object.keys(allRoles);
  const roleRights = new Map(Object.entries(allRoles));
  
  module.exports = {
    roles,
    roleRights,
  };
  