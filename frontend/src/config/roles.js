export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  KANTIN: 'kantin',
  KURIR: 'kurir',
};

export const getUserRole = (user) => {
  if (!user) return null;
  if (user.role) return user.role;
  if (user.roles && user.roles.length > 0) return user.roles[0].name;
  return ROLES.USER; // default fallback
};

/**
 * Helper function to check if a user has at least one of the required roles
 * @param {string} userRole - Current user's role
 * @param {string|string[]} allowedRoles - Role or array of roles allowed
 * @returns {boolean}
 */
export const hasRole = (userRole, allowedRoles) => {
  if (!userRole) return false;
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(userRole);
  }
  return userRole === allowedRoles;
};
