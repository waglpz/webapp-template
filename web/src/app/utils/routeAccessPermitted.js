import { useSelector } from 'react-redux';

export const userRoutingRightsMap = {};

export const routeAccessPermitted = (path) => {
  if (path === '' || path === '/') {
    return true;
  }

  const profile = useSelector((state) => {
    return state.profile;
  });
  const userRoles = profile?.authData?.userData?.roles;
  if (!userRoles || !userRoutingRightsMap[ path ] || userRoutingRightsMap[ path ].roles.length === 0) {
    return false;
  }
  const permitted = userRoles.filter((role) => {
    return userRoutingRightsMap[ path ].roles.includes(role);
  }).length > 0;

  return permitted;
};
