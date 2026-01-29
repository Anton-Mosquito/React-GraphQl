import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FilterFormValues } from '../../model/types/filters';

export const AdultField = () => {
  const { t } = useTranslation();
  const label = t('filters.include_adult');
  const { control } = useFormContext<FilterFormValues>();

  return (
    <Controller
      name="includeAdult"
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={<Checkbox {...field} checked={Boolean(field.value)} />}
          label={label}
        />
      )}
    />
  );
};
