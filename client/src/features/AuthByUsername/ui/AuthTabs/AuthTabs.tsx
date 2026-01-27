import { Box, Paper, Tab, Tabs, Typography, Link } from '@mui/material';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TabPanel } from '@/shared/ui/TabPanel';
import { a11yProps } from '@/shared/utils/a11y';

import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';

interface AuthTabsProps {
  onSuccess: () => void;
}

export const AuthTabs: FC<AuthTabsProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSwitchToLogin = () => {
    setValue(0);
  };

  const handleSwitchToRegister = () => {
    setValue(1);
  };

  return (
    <Paper elevation={3} sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label={t('authTabs.login') + ' / ' + t('authTabs.register')}
          variant="fullWidth"
        >
          <Tab
            label={t('authTabs.login')}
            {...a11yProps(0)}
            aria-controls="auth-tabpanel-0"
          />
          <Tab
            label={t('authTabs.register')}
            {...a11yProps(1)}
            aria-controls="auth-tabpanel-1"
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0} prefix="auth-tab">
        <Box sx={{ p: 2 }}>
          <LoginForm onSuccess={onSuccess} />
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('authTabs.dontHaveAccount')}{' '}
              <Link
                component="button"
                variant="body2"
                onClick={handleSwitchToRegister}
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                aria-label={t('authTabs.registerLink')}
              >
                {t('authTabs.registerLink')}
              </Link>
            </Typography>
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1} prefix="auth-tab">
        <Box sx={{ p: 2 }}>
          <RegisterForm onSuccess={onSuccess} />
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('register.alreadyHaveAccount')}{' '}
              <Link
                component="button"
                variant="body2"
                onClick={handleSwitchToLogin}
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                aria-label={t('register.loginLink')}
              >
                {t('register.loginLink')}
              </Link>
            </Typography>
          </Box>
        </Box>
      </TabPanel>
    </Paper>
  );
};
