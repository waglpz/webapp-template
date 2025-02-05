import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grow,
  Typography,
}                from '@mui/material';
import PropTypes from "prop-types";
import {
  useDispatch,
  useSelector,
}                from 'react-redux';

import { setGlobalAlertData } from '../app/slices/miscSlice';
import {
  API,
  handleApiProblem,
}                             from '../app/utils/ApiFetch';
import {
  nameToAbbreviation,
  stringToColor,
}                             from '../app/utils/helpers';

const growTimeout = 2487;
const q = 1.77;

function stringAvatar(name) {
  const _name = nameToAbbreviation(name);
  const style = { ...avatarStyle, bgcolor: stringToColor(name) };

  return { sx: { ...style }, children: `${_name}` };
}

const avatarStyle = {
  letterSpacing: 0,
  border: "0.005em outset #cccccc",
  textShadow: ".015em .015em .015em #cccccc",
  fontSize: `${3 / (q - 0.1)}rem`,
  fontWeight: "bold",
  width: 88 / q,
  height: 88 / q,
  bgcolor: stringToColor(name),
};

const cardStyle = {
  width: 260 / q,
  height: 260 / q,
  m: .88,
  bgcolor: '#f9f9f3',
  border: 0,
  borderRadius: .44,
  transition: 'transform 1s',
  transformStyle: 'preserve-3d',
};

const appTitleStyle = {
  ml: ".7em",
  fontWeight: "bold",
  fontSize: "0.8rem",
  textOverflow: "ellipsis",
  wordWrap: 'break-word',
  textShadow: ".05em .05em .15em #cccccc",
  width: `${132 / q}px`,
  height: `${124 / q}px`,
};

const descriptionStyle = {
  mt: -.7,
  color: "#444",
  height: `${100 / (q + 0.2)}px`,
  fontSize: "0.725rem",
  wordWrap: 'break-word',
  textShadow: ".05em .05em .15em #cccccc",
  lineHeight: 1,
};

export function WebappTile({ webapp }) {
  const { name, domain, description } = webapp;
  const dispatch = useDispatch();
  const profile = useSelector((state) => {
    return state.profile;
  });

  const onClick = () => {
    return (event) => {

      event.preventDefault();
      event.stopPropagation();
      const { type, identifier } = webapp;
      if (type !== 'INTERNAL' && type !== 'DEVELOP') {
        window.open(domain, '_blank');

        return;
      }
      API.POST(`/token`, {
        googleToken: profile.authData.token,
        webappId: identifier,
      })
        .then((data) => {
          window.open(`${domain}?token=${data.token}`, '_blank');
        })
        .catch((error) => {
          handleApiProblem(error, (alertConfig) => {
            dispatch(setGlobalAlertData({ ...alertConfig, show: true }));
          });
        });
    };
  };

  return (<Grow
    in={true}
    style={{ transformOrigin: '0 0 0' }}
    timeout={growTimeout}
  >
    <Card sx={cardStyle} square title={`${name} öffnen`} elevation={10}>
      <CardActionArea
        href={domain}
        onClick={onClick(domain)}
        target="_blank"
        sx={{ ...cardStyle, m: 0 }}>
        <CardContent sx={{ p: 1.25 }}>
          <Typography sx={{ display: "inline-flex" }} component="div">
            <Avatar {...stringAvatar(name)} variant="square" />
            <Box sx={{ ...appTitleStyle, color: stringToColor(name) }}>
              {name}&nbsp;
            </Box>
          </Typography>
          <Box sx={descriptionStyle}>
            {description}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  </Grow>);
}

WebappTile.propTypes = { webapp: PropTypes.object.isRequired };
