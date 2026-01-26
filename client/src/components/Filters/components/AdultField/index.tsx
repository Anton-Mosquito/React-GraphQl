import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';

export const AdultField = () => {
  const intl = useIntl();
  const label = intl.formatMessage({ id: 'filters.include_adult' });

  return (
    <Field
      name="includeAdult"
      type="checkbox"
      render={({ input }: any) => (
        <FormControlLabel
          control={<Checkbox {...(input as any)} checked={Boolean(input.value)} />}
          label={label}
        />
      )}
    />
  );
};
