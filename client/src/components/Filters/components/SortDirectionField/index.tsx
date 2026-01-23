import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import React from 'react';
import { Field } from 'react-final-form';
import { useIntl, FormattedMessage } from 'react-intl';

import { SORT_DIRECTION } from '../../../../const';

export const SortDirectionField: React.FC = () => {
  const intl = useIntl();
  const placeholder = intl.formatMessage({ id: 'filters.sort_direction' });

  return (
    <Field
      name="sortDirection"
      render={({ input }: any) => (
        <FormControl>
          <FormLabel id="sort_direction">{placeholder}</FormLabel>
          <RadioGroup row name="sort_directionp" {...input}>
            <FormControlLabel
              value={SORT_DIRECTION.ASC}
              control={<Radio />}
              label={<FormattedMessage id="filters.sort_direction_options.asc" />}
            />
            <FormControlLabel
              value={SORT_DIRECTION.DESC}
              control={<Radio />}
              label={<FormattedMessage id="filters.sort_direction_options.desc" />}
            />
          </RadioGroup>
        </FormControl>
      )}
    />
  );
};
