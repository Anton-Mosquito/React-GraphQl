import { Button, TextField, Typography, Stack, Box, CircularProgress } from '@mui/material';
import React, { memo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { LAST_REGISTERED_EMAIL_KEY } from '@/shared/const/localStorage';
import { DynamicModuleLoader, type ReducersList } from '@/shared/lib/components';
import { getErrorTranslationKey } from '@/shared/utils';
import { getFromStorage, removeFromStorage } from '@/shared/utils';

import { getLoginError, getLoginIsLoading } from '../../model/selectors';
import { loginByUserEmail } from '../../model/services/loginByUserEmail/loginByUserEmail';
import { loginReducer } from '../../model/slice/loginSlice';

export interface LoginFormProps {
  onSuccess: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const initialReducers: ReducersList = {
  loginForm: loginReducer,
};

const LoginForm = memo(({ onSuccess }: LoginFormProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isLoading = useSelector(getLoginIsLoading);
  const error = useSelector(getLoginError);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: getFromStorage<string>(LAST_REGISTERED_EMAIL_KEY) || '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(loginByUserEmail(data));
    if (loginByUserEmail.fulfilled.match(result)) {
      // Clear the saved email after successful login
      removeFromStorage(LAST_REGISTERED_EMAIL_KEY);
      onSuccess();
    }
  };

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        role="form"
        aria-labelledby="login-title"
      >
        <Stack spacing={2}>
          <Typography variant="h6" id="login-title">
            {t('login.title')}
          </Typography>
          {error && (
            <Typography color="error" role="alert" aria-live="polite">
              {t(`errors.${getErrorTranslationKey(error)}`)}
            </Typography>
          )}
          <TextField
            label={t('login.email')}
            {...register('email', { required: t('login.emailRequired') })}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            autoComplete="email"
            aria-describedby={errors.email ? 'email-error' : undefined}
            id="email"
          />
          <TextField
            label={t('login.password')}
            type="password"
            {...register('password', { required: t('login.passwordRequired') })}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            autoComplete="current-password"
            aria-describedby={errors.password ? 'password-error' : undefined}
            id="password"
          />
          <Button
            type="submit"
            variant="outlined"
            disabled={isLoading}
            fullWidth
            aria-label={isLoading ? t('login.submitting') : t('login.submit')}
          >
            {isLoading ? <CircularProgress size={24} aria-hidden="true" /> : t('login.submit')}
          </Button>
        </Stack>
      </Box>
    </DynamicModuleLoader>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
