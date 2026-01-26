import ErrorIcon from '@mui/icons-material/Error';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export const ErrorPage = (): ReactElement => {
  const { t } = useTranslation();

  const reloadPage = (): void => {
    location.reload();
  };

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
      <ErrorIcon
        sx={{
          fontSize: 80,
          color: 'error.main',
          mb: 2,
        }}
      />
      <Typography variant="h4" component="h1" gutterBottom>
        {t('errorPage.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('errorPage.description')}
      </Typography>
      <Button variant="contained" color="primary" onClick={reloadPage}>
        {t('errorPage.reloadButton')}
      </Button>
    </Box>
  );
};
