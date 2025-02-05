import { PropTypes }   from 'prop-types';
import { Fragment }    from 'react';
import {
  useDispatch,
  useSelector,
}                      from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logout }          from '../app/slices/profileSlice';
import { checkTokenValid } from '../app/utils/auth';
import { detach }          from '../app/utils/detach';
import errorPages          from '../pages/Error/t9n/de.json';

export const RouteGuard = ({ children, roles }) => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => {
    return state.profile;
  });
  const navigate = useNavigate();

  const tokenValid = checkTokenValid();
  if (!tokenValid || profile.authData.userData.roles.length < 1) {
    detach(() => {
      dispatch(logout());
    });

    return (<></>);
  }

  const userRoles = profile.authData.userData.roles;
  const intersectRoles = userRoles.filter((role) => {
    return roles.includes(role);
  });
  const userHasAccess = intersectRoles.length > 0;

  if (userHasAccess) {
    return (
      <Fragment>
        {children}
      </Fragment>
    );
  } else {
    detach(() => {
      navigate(errorPages.notFoundPage.route.pageNotFound);
    });

    return (<></>);
  }
};

RouteGuard.propTypes = {
  children: PropTypes.object.isRequired,
  roles: PropTypes.array.isRequired,
};
