import { Box, CircularProgress, Typography, Button, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

import { useActivateQuery } from '@/entities/User/api/userApi';
import { getRouteMain } from '@/shared/const/router';

const ActivatePage = () => {
  const { t } = useTranslation();
  const { link } = useParams<{ link: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useActivateQuery(link);

  const handleGoToLogin = () => {
    navigate(getRouteMain());
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
          p: 3,
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2 }} aria-hidden="false" />
        <Typography variant="h6" aria-live="polite">
          {t('activatePage.loading')}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ mb: 3, maxWidth: 400 }} role="alert" aria-live="assertive">
          {t('activatePage.error')}
        </Alert>
        <Button
          variant="contained"
          onClick={handleGoToLogin}
          aria-label={t('activatePage.goToLogin')}
        >
          {t('activatePage.goToLogin')}
        </Button>
      </Box>
    );
  }

  if (data) {
    const severity = data.success ? 'success' : 'warning';
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
          p: 3,
        }}
      >
        <Alert severity={severity} sx={{ mb: 3, maxWidth: 400 }} role="alert" aria-live="assertive">
          {data.message}
        </Alert>
        <Button
          variant="contained"
          onClick={handleGoToLogin}
          aria-label={t('activatePage.goToLogin')}
        >
          {t('activatePage.goToLogin')}
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h6" role="alert" aria-live="assertive">
        {t('activatePage.invalidLink')}
      </Typography>
    </Box>
  );
};

ActivatePage.displayName = 'ActivatePage';

export default ActivatePage;
