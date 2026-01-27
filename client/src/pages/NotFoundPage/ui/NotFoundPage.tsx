import { ErrorOutline } from '@mui/icons-material';
import { Box, Typography, Button } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const { t } = useTranslation();
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
        {t('notFoundPage.title')}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {t('notFoundPage.description')}
      </Typography>
      <Button variant="contained" onClick={handleGoHome}>
        {t('notFoundPage.goHome')}
      </Button>
    </Box>
  );
};

export default NotFoundPage;
