import ErrorIcon from '@mui/icons-material/Error';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { ReactElement } from 'react';
import { useIntl } from 'react-intl';

export const ErrorPage = (): ReactElement => {
  const intl = useIntl();

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
        {intl.formatMessage({ id: 'errorPage.title' })}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {intl.formatMessage({ id: 'errorPage.description' })}
      </Typography>
      <Button variant="contained" color="primary" onClick={reloadPage}>
        {intl.formatMessage({ id: 'errorPage.reloadButton' })}
      </Button>
    </Box>
  );
};
