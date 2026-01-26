import CheckIcon from '@mui/icons-material/Check';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import React from 'react';
import { Form, Field } from 'react-final-form';
import { useIntl } from 'react-intl';

interface SelectedMoviesFormProps {
  onSubmit?: (values: { listName?: string }) => void | Promise<void>;
}

const SelectedMoviesForm = ({ onSubmit }: SelectedMoviesFormProps) => {
  const intl = useIntl();
  const placeholder = intl.formatMessage({ id: 'put_the_list_name' });

  return (
    <Form
      onSubmit={onSubmit}
      validate={(values: { listName?: string }) => {
        const errors: { listName?: string } = {};

        if (!values.listName) {
          errors.listName = 'Required';
        }

        return errors;
      }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
            <Field
              name="listName"
              render={({ input }) => (
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder={placeholder}
                  inputProps={{ 'aria-label': 'put list name' }}
                  {...input}
                />
              )}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton type="submit" color="primary" sx={{ p: '10px' }} aria-label="directions">
              <CheckIcon />
            </IconButton>
          </Paper>
        </form>
      )}
    />
  );
};

export default SelectedMoviesForm;
