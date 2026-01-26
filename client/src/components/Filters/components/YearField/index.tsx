import TextField from '@mui/material/TextField';
import React from 'react';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';

export const YearField = () => {
  const intl = useIntl();
  const label = intl.formatMessage({ id: 'filters.year' });

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
