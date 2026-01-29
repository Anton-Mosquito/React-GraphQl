import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FilterFormValues, GenreFieldProps } from '../../model/types/filters';

export const GenreField = ({ data }: GenreFieldProps) => {
  const { t } = useTranslation();
  const placeholder = t('filters.genre');
  const { control } = useFormContext<FilterFormValues>();

  const genres = data?.genres || [];

  return (
    <Controller
      name="genre"
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
            {genres
              .filter((genre): genre is NonNullable<typeof genre> => genre !== null)
              .map((genre) => (
                <MenuItem key={genre.id} value={genre.id}>
                  {genre.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      )}
    />
  );
};
