const allRoles = {
  USER: ['manageUser'],
  ADMIN: ['manageUser'],
  FOUNDER: [],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

export { roles, roleRights };
