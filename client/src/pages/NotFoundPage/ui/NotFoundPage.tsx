import React from 'react';
import { ErrorOutline } from '@mui/icons-material';
import { Box, Typography, Button } from '@mui/material';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ textAlign: 'center', p: 2 }}
    >
      <ErrorOutline sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        {intl.formatMessage({ id: 'notFoundPage.title' })}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {intl.formatMessage({ id: 'notFoundPage.description' })}
      </Typography>
      <Button variant="contained" onClick={handleGoHome}>
        {intl.formatMessage({ id: 'notFoundPage.goHome' })}
      </Button>
    </Box>
  );
};

export default NotFoundPage;
