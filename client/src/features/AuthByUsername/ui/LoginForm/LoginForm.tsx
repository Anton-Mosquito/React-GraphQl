import React, { memo, useCallback } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './LoginForm.module.scss';
import { useTranslation } from 'react-i18next';
import { Button as ButtonDeprecated, ThemeButton } from '@/shared/ui/deprecated/Button';
import { Button } from '@/shared/ui/redesigned/Button';
import { Input as InputDeprecated } from '@/shared/ui/deprecated/Input';
import { Input } from '@/shared/ui/redesigned/Input';
import { useSelector } from 'react-redux';
import { memo, useCallback } from 'react';
import { loginActions, loginReducer } from '../../model/slice/loginSlice';
import { loginByUserName } from '../../model/services/loginByUserName/loginByUserName';
import { Text as TextDeprecated, TextTheme } from '@/shared/ui/deprecated/Text';
import { Text } from '@/shared/ui/redesigned/Text';
import { getLoginUserName } from '../../model/selectors/getLoginUserName/getLoginUserName';
import { getLoginPassword } from '../../model/selectors/getLoginPassword/getLoginPassword';
import { getLoginIsLoading } from '../../model/selectors/getLoginIsLoading/getLoginLoading';
import { getLoginError } from '../../model/selectors/getLoginError/getLoginError';
import {
  DynamicModuleLoader,
  type ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { ToggleFeatures } from '@/shared/lib/features';
import { VStack } from '@/shared/ui/redesigned/Stack';
import { useForceUpdate } from '@/shared/lib/render/forceUpdate';

export interface LoginFormProps {
  className?: string;
  onSuccess: () => void;
}

const initialReducers: ReducersList = {
  loginForm: loginReducer,
};

const LoginForm = memo(({ className, onSuccess }: LoginFormProps): React.JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const username = useSelector(getLoginUserName);
  const password = useSelector(getLoginPassword);
  const isLoading = useSelector(getLoginIsLoading);
  const error = useSelector(getLoginError);
  const forceUpdate = useForceUpdate();

  const onChangeUserName = useCallback(
    (value: string) => {
      dispatch(loginActions.setUserName(value));
    },
    [dispatch],
  );

  const onChangePassword = useCallback(
    (value: string) => {
      dispatch(loginActions.setPassword(value));
    },
    [dispatch],
  );

  const onLoginClick = useCallback(async () => {
    const result = await dispatch(loginByUserName({ username, password }));
    if (result.meta.requestStatus === 'fulfilled') {
      onSuccess();
      forceUpdate();
    }
  }, [dispatch, onSuccess, password, username, forceUpdate]);

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <ToggleFeatures
        feature="isAppRedesigned"
        on={
          <VStack gap="16" className={classNames(cls.LoginForm, {}, [className])}>
            <Text title={t('Форма авторизации')} />
            {Boolean(error) && <Text text={t(error)} variant="accent" />}
            <Input
              type="text"
              className={cls.input}
              placeholder={t('Введите username')}
              autofocus
              onChange={onChangeUserName}
              value={username}
            />
            <Input
              type="text"
              className={cls.input}
              placeholder={t('Введите password')}
              onChange={onChangePassword}
              value={password}
            />
            <Button
              className={cls.loginBtn}
              variant="outline"
              onClick={() => {
                void onLoginClick();
              }}
              disabled={isLoading}
            >
              {t('Войти')}
            </Button>
          </VStack>
        }
        off={
          <div className={classNames(cls.LoginForm, {}, [className])}>
            <TextDeprecated title={t('Форма авторизации')} />
            {Boolean(error) && <TextDeprecated text={t(error)} theme={TextTheme.ERROR} />}
            <InputDeprecated
              type="text"
              className={cls.input}
              placeholder={t('Введите username')}
              autofocus
              onChange={onChangeUserName}
              value={username}
            />
            <InputDeprecated
              type="text"
              className={cls.input}
              placeholder={t('Введите password')}
              onChange={onChangePassword}
              value={password}
            />
            <ButtonDeprecated
              className={cls.loginBtn}
              theme={ThemeButton.OUTLINE}
              onClick={() => {
                void onLoginClick();
              }}
              disabled={isLoading}
            >
              {t('Войти')}
            </ButtonDeprecated>
          </div>
        }
      />
    </DynamicModuleLoader>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
