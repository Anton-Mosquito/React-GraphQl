import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { SORT_OPTIONS } from '@/shared/const/sort';

import type { FilterFormValues } from '../../model/types/filters';

export const SortField = () => {
  const { t } = useTranslation();
  const placeholder = t('filters.sort_by');
  const { control } = useFormContext<FilterFormValues>();

  return (
    <Controller
      name="sortBy"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">{placeholder}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            autoWidth
            label={placeholder}
            {...field}
          >
            {SORT_OPTIONS.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {t(`filters.sort.${label}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
};
