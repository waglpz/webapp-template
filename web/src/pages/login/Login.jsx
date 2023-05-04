import React from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Box} from "@mui/material";

import {login} from '../../app/slices/userSlice';
import * as API from "../../app/utils/ApiFetch";
import {decodeToken} from "../../app/utils/decodeToken";
import {__forbidden} from "../error/__";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const googleBtnWrapperRef = React.useRef(null);
  const googleLoginCallback = (response, error) => {
    if (response && response.credential) {
      apiLogin(response.credential)
    } else {
      // TODO: check what errors can google login return
      console.log('google login error:: ', error);
    }
  }

  const apiLogin = (googleToken) => {
    const decodedData = decodeToken(googleToken);
    if (decodedData.email) {
      API.POST('/login', {email: decodedData.email})
        .then((userData) => {
          decodedData.token = googleToken;
          decodedData.isAdmin = userData.isAdmin;
          decodedData.visible = userData.visible;
          decodedData.userId = userData.userId;
          dispatch(login(decodedData));
        })
        .catch((error) => {
          const status = error?.response?.status;
          if (status === 403 || status === 401) {
            navigate(__forbidden.route.forbidden)
          } else {
            console.error('TODO: Improve ERROR.', error)
          }
        });
    }
  }

  React.useEffect(() => {
    if (googleBtnWrapperRef.current && window.google !== undefined) {
      const googleRef = window.google.accounts.id;
      googleRef.initialize({
        client_id: process.env.REACT_APP_GOOGLECLIENTID,
        callback: googleLoginCallback,
      });
      googleRef.renderButton(googleBtnWrapperRef.current, {
        shape: "pill",
        theme: "filled_black",
        text: "signin_with",
        size: "large",
        locale: "de",
        logo_alignment: "center",
      });
    }
  }, [googleBtnWrapperRef.current]);

  return (
    <Box sx={{
      display: "flex",
      width: "100%",
      height: "500px",
      bgcolor: "transparent",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{fontSize: "24px"}} ref={googleBtnWrapperRef}></div>
    </Box>
  );
};
export default LoginPage;
