import TextField from '@mui/material/TextField';
import React from 'react';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';

export const ReleaseYearField = () => {
  const intl = useIntl();
  const label = intl.formatMessage({ id: 'filters.release_year' });

  return (
    <Field
      name="primaryReleaseYear"
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
