import { useQuery } from '@apollo/client/react';
import Box from '@mui/material/Box';
import React from 'react';
import { Form } from 'react-final-form';

import {
  SortField,
  SortDirectionField,
  AdultField,
  YearField,
  SubmitField,
  ReleaseYearField,
  GenreField,
} from './components';
import { GENRES_QUERY } from './queries';

interface FiltersProps {
  onSubmit?: (values: any) => void;
  initialValues?: any;
}

export const Filters = ({ onSubmit, initialValues }: FiltersProps) => {
  const { loading, error, data } = useQuery(GENRES_QUERY as any);

  if (loading) {
    return <>Loading ...</>;
  }

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ handleSubmit, form, submitting, pristine, values }: any) => (
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box mr={3}>
                  <YearField />
                </Box>

                <Box mr={3}>
                  <ReleaseYearField />
                </Box>

                <Box mr={3}>
                  <GenreField data={data} />
                </Box>

                <AdultField />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box mr={3}>
                  <SortField />
                </Box>

                <SortDirectionField />
              </Box>
            </Box>
            <Box>
              <SubmitField />
            </Box>
          </form>
        )}
      />
    </div>
  );
};

export default Filters;
