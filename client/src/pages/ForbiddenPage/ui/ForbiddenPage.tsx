import { Block } from '@mui/icons-material';
import { Box, Typography, Button } from '@mui/material';
import { useIntl } from 'react-intl';

const ForbiddenPage = () => {
  const intl = useIntl();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ textAlign: 'center', p: 2 }}
      data-testid="ForbiddenPage"
    >
      <Block sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        {intl.formatMessage({ id: 'forbiddenPage.title' })}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {intl.formatMessage({ id: 'forbiddenPage.description' })}
      </Typography>
      <Button variant="contained" onClick={() => window.history.back()}>
        {intl.formatMessage({ id: 'forbiddenPage.goBack' })}
      </Button>
    </Box>
  );
};

export default ForbiddenPage;
