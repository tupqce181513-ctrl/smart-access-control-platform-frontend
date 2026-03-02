import { ROLES } from './constants';

/**
 * Check if user is admin
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return user?.role === ROLES.ADMIN;
};

/**
 * Check if user is owner
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isOwner = (user) => {
  return user?.role === ROLES.OWNER;
};

/**
 * Check if user is member
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isMember = (user) => {
  return user?.role === ROLES.MEMBER;
};

/**
 * Check if user can manage a device (edit, delete)
 * @param {Object} user - User object
 * @param {Object} device - Device object
 * @returns {boolean}
 */
export const canManageDevice = (user, device) => {
  if (!user || !device) return false;
  
  // Admin can manage any device
  if (isAdmin(user)) return true;
  
  // Owner can manage their own devices
  if (device.ownerId === user._id || device.ownerId?._id === user._id) {
    return true;
  }
  
  return false;
};

/**
 * Check if user can grant access to a device
 * @param {Object} user - User object
 * @param {Object} device - Device object
 * @returns {boolean}
 */
export const canGrantAccess = (user, device) => {
  if (!user || !device) return false;
  
  // Admin can grant access to any device
  if (isAdmin(user)) return true;
  
  // Owner can grant access to their own devices
  if (device.ownerId === user._id || device.ownerId?._id === user._id) {
    return true;
  }
  
  return false;
};

/**
 * Check if user can revoke an access permission
 * @param {Object} user - User object
 * @param {Object} permission - Permission object
 * @param {Object} device - Device object
 * @returns {boolean}
 */
export const canRevokeAccess = (user, permission, device) => {
  if (!user || !permission || !device) return false;
  
  // Admin can revoke any permission
  if (isAdmin(user)) return true;
  
  // Device owner can revoke permissions for their devices
  if (device.ownerId === user._id || device.ownerId?._id === user._id) {
    return true;
  }
  
  // User who created the permission can revoke it
  if (permission.grantedBy === user._id || permission.grantedBy?._id === user._id) {
    return true;
  }
  
  return false;
};

/**
 * Get navigation items based on user role
 * @param {string} role - User role (admin, owner, or member)
 * @returns {Array} Array of navigation items
 */
export const getNavItems = (role) => {
  const commonItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Notifications', path: '/notifications', icon: 'Bell' },
    { name: 'Profile', path: '/profile', icon: 'User' },
  ];

  if (role === ROLES.ADMIN) {
    return [
      { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
      { name: 'Devices', path: '/devices', icon: 'Smartphone' },
      { name: 'Access Management', path: '/access', icon: 'Key' },
      { name: 'Users', path: '/admin/users', icon: 'Users' },
      { name: 'All Logs', path: '/logs', icon: 'FileText' },
      { name: 'Notifications', path: '/notifications', icon: 'Bell' },
      { name: 'Profile', path: '/profile', icon: 'User' },
    ];
  }

  if (role === ROLES.OWNER) {
    return [
      { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
      { name: 'Devices', path: '/devices', icon: 'Smartphone' },
      { name: 'Access Management', path: '/access', icon: 'Key' },
      { name: 'Logs', path: '/logs', icon: 'FileText' },
      { name: 'Notifications', path: '/notifications', icon: 'Bell' },
      { name: 'Profile', path: '/profile', icon: 'User' },
    ];
  }

  if (role === ROLES.MEMBER) {
    return [
      { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
      { name: 'My Devices', path: '/devices', icon: 'Smartphone' },
      { name: 'My Access', path: '/access', icon: 'Key' },
      { name: 'Notifications', path: '/notifications', icon: 'Bell' },
      { name: 'Profile', path: '/profile', icon: 'User' },
    ];
  }

  return commonItems;
};
