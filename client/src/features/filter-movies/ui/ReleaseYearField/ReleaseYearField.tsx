import TextField from '@mui/material/TextField';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FilterFormValues } from '../../model/types/filters';

export const ReleaseYearField = () => {
  const { t } = useTranslation();
  const label = t('filters.release_year');
  const { control } = useFormContext<FilterFormValues>();

  return (
    <Controller
      name="primaryReleaseYear"
      control={control}
      render={({ field }) => (
        <TextField
          id="outlined-basic"
          label={label}
          variant="outlined"
          type="number"
          inputProps={{ min: 1800, max: 2030 }}
          {...field}
        />
      )}
    />
  );
};
