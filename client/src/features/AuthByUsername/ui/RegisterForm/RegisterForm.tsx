import {
  Button,
  TextField,
  Typography,
  Stack,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import React, { memo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { LAST_REGISTERED_USERNAME_KEY } from '@/shared/const/localStorage';
import { DynamicModuleLoader, type ReducersList } from '@/shared/lib/components';
import { getErrorTranslationKey } from '@/shared/utils';
import { saveToStorage } from '@/shared/utils';

import { getRegisterIsLoading, getRegisterError } from '../../model/selectors';
import { registrationByUserName } from '../../model/services/registrationByUserName/registrationByUserName';
import { registerReducer } from '../../model/slice/registerSlice';

export interface RegisterFormProps {
  onSuccess: () => void;
}

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const initialReducers: ReducersList = {
  registerForm: registerReducer,
};

const RegisterForm = memo(({ onSuccess }: RegisterFormProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isLoading = useSelector(getRegisterIsLoading);
  const error = useSelector(getRegisterError);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterFormData>();

  const password = useWatch({
    control,
    name: 'password',
  });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await dispatch(registrationByUserName(data));
    if (registrationByUserName.fulfilled.match(result)) {
      saveToStorage(LAST_REGISTERED_USERNAME_KEY, data.username);
      setSuccessMessage(t('register.successMessage'));
    }
  };

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        role="form"
        aria-labelledby="register-title"
      >
        <Stack spacing={2}>
          <Typography variant="h6" id="register-title">
            {t('register.title')}
          </Typography>
          {error && (
            <Typography color="error" role="alert" aria-live="polite">
              {t(`errors.${getErrorTranslationKey(error)}`)}
            </Typography>
          )}
          <TextField
            label={t('register.email')}
            type="email"
            {...register('email', {
              required: t('register.emailRequired'),
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: t('register.emailInvalid'),
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            autoComplete="email"
            aria-describedby={errors.email ? 'email-error' : undefined}
            id="email"
          />
          <TextField
            label={t('register.username')}
            {...register('username', { required: t('register.usernameRequired') })}
            error={!!errors.username}
            helperText={errors.username?.message}
            fullWidth
            autoComplete="username"
            aria-describedby={errors.username ? 'username-error' : undefined}
            id="username"
          />
          <TextField
            label={t('register.password')}
            type="password"
            {...register('password', {
              required: t('register.passwordRequired'),
              minLength: { value: 8, message: t('register.passwordMinLength') },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            autoComplete="new-password"
            aria-describedby={errors.password ? 'password-error' : undefined}
            id="new-password"
          />
          <TextField
            label={t('register.confirmPassword')}
            type="password"
            {...register('confirmPassword', {
              required: t('register.confirmPasswordRequired'),
              validate: (value) => value === password || t('register.passwordsDoNotMatch'),
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            fullWidth
            autoComplete="new-password"
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
            id="confirm-password"
          />
          <Button
            type="submit"
            variant="outlined"
            disabled={isLoading}
            fullWidth
            aria-label={isLoading ? t('register.submitting') : t('register.submit')}
          >
            {isLoading ? <CircularProgress size={24} aria-hidden="true" /> : t('register.submit')}
          </Button>
        </Stack>
      </Box>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </DynamicModuleLoader>
  );
});

RegisterForm.displayName = 'RegisterForm';

export default RegisterForm;
