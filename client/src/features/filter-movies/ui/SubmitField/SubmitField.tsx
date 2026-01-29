import Button from '@mui/material/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const SubmitField = () => {
  const { t } = useTranslation();

  return (
    <Button variant="contained" type="submit" size="large">
      {t('filters.submit')}
    </Button>
  );
};
