import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React from 'react';
import { Field } from 'react-final-form';
import { useIntl, FormattedMessage } from 'react-intl';

import { SORT_OPTIONS } from '../../../../const';

export const SortField = () => {
  const intl = useIntl();
  const placeholder = intl.formatMessage({ id: 'filters.sort_by' });

  return (
    <Field
      name="sortBy"
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
            {SORT_OPTIONS.map(({ label, value }: any) => (
              <MenuItem key={value} value={value}>
                <FormattedMessage id={`filters.sort.${label}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
};
