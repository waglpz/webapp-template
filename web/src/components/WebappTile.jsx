import * as React from 'react';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import Grow from "@mui/material/Grow";
import {stringToColor} from "../app/utils/stringToColor";

function stringAvatar(name) {
  const words = name.split(' ');
  const firstLetter = words[0][0];
  const secondLetter = words.length > 1 ? words[1][0] : '';
  const style = {...avatarStyle, bgcolor: stringToColor(name)}
  return {
    sx: {...style},
    children: `${firstLetter}${secondLetter}`,
  };
}

const avatarStyle = {
  letterSpacing: 0,
  border: "0.005em outset #cccccc",
  boxShadow: ".075em .075em .1em #bbbbbb",
  fontSize: "4.5rem",
  fontFamily: 'Monospace',
  fontWeight: "bold",
  width: 120,
  height: 120,
  bgcolor: stringToColor(name),
};

const cardStyle = {
  width: 270,
  height: 260,
  m: 3,
  mb: 3,
  bgcolor: '#f5f9af',
  border: 0,
  boxShadow: ".4em .4em .7em #cccccc",
  transition: 'transform 1s',
  transformStyle: 'preserve-3d',
};

const appTitleStyle = {
  ml: ".72em",
  fontWeight: "bold",
  fontFamily: "Monospace",
  fontSize: "1.18rem",
  textTransform: "uppercase",
  textOverflow: "ellipsis",
  overflow: "hidden",
  wordWrap: 'break-word',
  textShadow: ".2em .2em .5em #888888",
  width: "132px",
  height: "124px",
};

const descriptionStyle = {mt: 2, height: "100px", textOverflow: "ellipsis", overflow: "hidden"};

export default function WebappTile({appTitle, description, url}) {
  return (
    <Grow
      in={true}
      style={{transformOrigin: '0 0 0'}}
      timeout={1789}
    >
      <Card sx={cardStyle} variant="elevation" square title={`${appTitle} öffnen`}>
        <CardActionArea href={url} target='_blank' sx={{...cardStyle, m: 0}}>
          <CardContent>
            <Typography sx={{display: "inline-flex"}} component="div">
              <Avatar {...stringAvatar(appTitle)} variant="square"/>
              <Box sx={{...appTitleStyle, color: stringToColor(appTitle),}}>
                {appTitle}&nbsp;
              </Box>
            </Typography>
            <Box sx={descriptionStyle}>
              {description}
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grow>
  );
}

WebappTile.propTypes = {
  appTitle: PropTypes.string.isRequired,
  description: PropTypes.string,
  url: PropTypes.string.isRequired,
};
