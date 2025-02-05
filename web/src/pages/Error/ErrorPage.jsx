import {
  Button,
  CardContent,
  Typography,
}                      from '@mui/material';
import PropTypes       from 'prop-types';
import { useNavigate } from 'react-router-dom';

import t9n from './t9n/de.json';

const NotFoundPage = () => {
  return (
    <ErrorPage title={t9n.notFoundPage.page.label.title}
               subtitle={t9n.notFoundPage.page.label.subtitle} />
  );
};

const ForbiddenPage = () => {
  return (
    <ErrorPage title={t9n.forbidden.page.label.title}
               subtitle={t9n.forbidden.page.label.subtitle} />
  );
};

const UnauthorizedPage = () => {
  return (
    <ErrorPage title={t9n.unauthorized.page.label.title}
               subtitle={t9n.unauthorized.page.label.subtitle} />
  );
};

const ErrorPage = ({
                     title,
                     subtitle,
                   }) => {
  const navigate = useNavigate();

  return (
    <>
      <CardContent>
        <Typography
          sx={{
            textShadow: '.1em 0.1em .15em black',
            color: 'gray',
          }}
          variant="h1"
          component="h1"
          align="center"
          boxShadow={4}
        >
          {title}
        </Typography>
        <Typography variant="p" component="p" sx={{
          pt: 4,
          pb: 4,
        }} align="center">
          {subtitle} <Button onClick={() => {
          return navigate('/');
        }}
                             variant="outlined">{t9n.gotoStartpage}</Button>
        </Typography>

      </CardContent>
    </>
  );
};

ErrorPage.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export {
  ErrorPage,
  ForbiddenPage,
  UnauthorizedPage,
  NotFoundPage,
};
