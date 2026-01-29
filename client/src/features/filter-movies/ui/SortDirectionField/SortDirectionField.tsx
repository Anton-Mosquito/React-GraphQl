import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { SORT_DIRECTION } from '@/shared/const/sort';

import type { FilterFormValues } from '../../model/types/filters';

export const SortDirectionField = () => {
  const { t } = useTranslation();
  const placeholder = t('filters.sort_direction');
  const { control } = useFormContext<FilterFormValues>();

  return (
    <Controller
      name="sortDirection"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <FormControl>
          <FormLabel id="sort_direction">{placeholder}</FormLabel>
          <RadioGroup row {...field}>
            <FormControlLabel
              value={SORT_DIRECTION.ASC}
              control={<Radio />}
              label={t('filters.sort_direction_options.asc')}
            />
            <FormControlLabel
              value={SORT_DIRECTION.DESC}
              control={<Radio />}
              label={t('filters.sort_direction_options.desc')}
            />
          </RadioGroup>
        </FormControl>
      )}
    />
  );
};
