import { useQuery } from '@apollo/client/react';
import Box from '@mui/material/Box';
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import type { GenresQuery } from '@/gql/graphql';

import { GENRES_QUERY } from '../../api/filterApi';
import type { FilterFormValues, FiltersProps } from '../../model/types/filters';
import { AdultField } from '../AdultField';
import { GenreField } from '../GenreField';
import { ReleaseYearField } from '../ReleaseYearField';
import { SortDirectionField } from '../SortDirectionField';
import { SortField } from '../SortField';
import { SubmitField } from '../SubmitField';
import { YearField } from '../YearField';

export const Filters = ({ onSubmit, initialValues }: FiltersProps) => {
  const { loading, data } = useQuery<GenresQuery>(GENRES_QUERY);
  const methods = useForm<FilterFormValues>({ defaultValues: initialValues });

  if (loading) {
    return <>Loading ...</>;
  }

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
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
      </FormProvider>
    </div>
  );
};
