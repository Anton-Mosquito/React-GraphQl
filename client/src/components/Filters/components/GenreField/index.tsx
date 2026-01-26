import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React from 'react';
import { Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';

interface GenreFieldProps {
  data?: any;
}

export const GenreField = ({ data }: GenreFieldProps) => {
  const { t } = useTranslation();
  const placeholder = t('filters.genre');

  const genres = data?.genres || [];

  return (
    <Field
      name="genre"
      render={({ input }: any) => (
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">{placeholder}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            autoWidth
            label={placeholder}
            {...input}
          >
            {genres.map(({ name, id }: any) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
};
