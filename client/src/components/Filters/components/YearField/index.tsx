import TextField from '@mui/material/TextField';
import React from 'react';
import { Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';

export const YearField = () => {
  const { t } = useTranslation();
  const label = t('filters.year');

  return (
    <Field
      name="year"
      render={({ input }: any) => (
        <TextField
          id="outlined-basic"
          label={label}
          variant="outlined"
          type="number"
          inputProps={{ min: 1800, max: 2030 }}
          {...input}
        />
      )}
    />
  );
};
