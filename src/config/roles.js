const allRoles = {
    admin: ['getUsers', 'manageUsers', 'verifyUsers'],
    employer: ['postJob'],
    employee: [],
  };
  
  const roles = Object.keys(allRoles);
  const roleRights = new Map(Object.entries(allRoles));
  
  module.exports = {
    roles,
    roleRights,
  };
  