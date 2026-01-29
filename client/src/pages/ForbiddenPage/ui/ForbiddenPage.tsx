import { Block } from '@mui/icons-material';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ForbiddenPage = () => {
  const { t } = useTranslation();

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
        {t('forbiddenPage.title')}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {t('forbiddenPage.description')}
      </Typography>
      <Button variant="contained" onClick={() => window.history.back()}>
        {t('forbiddenPage.goBack')}
      </Button>
    </Box>
  );
};

export default ForbiddenPage;
