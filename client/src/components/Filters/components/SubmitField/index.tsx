import Button from '@mui/material/Button';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export const SubmitField = () => {
  return (
    <Button variant="contained" type="submit" size="large">
      <FormattedMessage id="filters.submit" />
    </Button>
  );
};
