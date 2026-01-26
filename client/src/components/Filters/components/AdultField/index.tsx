import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';
import { Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';

export const AdultField = () => {
  const { t } = useTranslation();
  const label = t('filters.include_adult');

  return (
    <Field
      name="includeAdult"
      type="checkbox"
      render={({ input }: any) => (
        <FormControlLabel
          control={<Checkbox {...(input as any)} checked={Boolean(input.value)} />}
          label={label}
        />
      )}
    />
  );
};
