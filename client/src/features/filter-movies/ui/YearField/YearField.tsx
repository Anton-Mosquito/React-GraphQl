import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FilterFormValues } from '../../model/types/filters';

export const YearField = () => {
  const { t } = useTranslation();
  const label = t('filters.year');
  const { control } = useFormContext<FilterFormValues>();

  return (
    <Controller
      name="year"
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
