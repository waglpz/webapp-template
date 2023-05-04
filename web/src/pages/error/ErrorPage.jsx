import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  CardContent,
  Typography
} from '@mui/material';
import Button from '@mui/material/Button';

import {
  __forbidden,
  __notFoundPage,
  __unauthorized,
  __gotoStartpage,
} from './__';

const NotFoundPage = () => {
  return (
    <ErrorPage title={__notFoundPage.page.label.title} subtitle={__notFoundPage.page.label.subtitle}/>
  );
};

const ForbiddenPage = () => {
  return (
    <ErrorPage title={__forbidden.page.label.title} subtitle={__forbidden.page.label.subtitle}/>
  );
};

const UnauthorizedPage = () => {
  return (
    <ErrorPage title={__unauthorized.page.label.title} subtitle={__unauthorized.page.label.subtitle}/>
  );
};


const ErrorPage = ({title, subtitle}) => {
  const navigate = useNavigate();

  return (
    <>
      <CardContent>
        <Typography
          sx={{textShadow: ".1em 0.1em .15em black", color: "gray"}}
          variant="h1"
          component="h1"
          align="center"
          boxShadow={4}
        >
          {title}
        </Typography>
        <Typography variant="p" component='p' sx={{pt:4, pb:4}} align="center">
          {subtitle} <Button  onClick={() => navigate('/')} variant="outlined">{__gotoStartpage}</Button>
        </Typography>

      </CardContent>
    </>
  );
};

ErrorPage.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export {ErrorPage, ForbiddenPage, UnauthorizedPage, NotFoundPage};
