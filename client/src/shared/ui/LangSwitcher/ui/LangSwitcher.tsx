import LanguageIcon from '@mui/icons-material/Language';
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  type SelectChangeEvent,
  InputAdornment,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

const LOCALES = {
  ENGLISH: 'en-US',
  UKRANIAN: 'uk-UA',
} as const;

interface LangSwitcherProps {
  className?: string;
}

export const LangSwitcher = ({ className }: LangSwitcherProps) => {
  const { i18n } = useTranslation();

  const handleChange = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ m: 1, minWidth: 120 }} className={className}>
      <InputLabel id="lang-select-label">Мова</InputLabel>
      <Select
        labelId="lang-select-label"
        value={i18n.language}
        label="language"
        onChange={handleChange}
        startAdornment={
          <InputAdornment position="start">
            <LanguageIcon sx={{ fontSize: 20, ml: 1 }} />
          </InputAdornment>
        }
        sx={{ borderRadius: 2 }}
      >
        <MenuItem value={LOCALES.UKRANIAN}>Українська</MenuItem>
        <MenuItem value={LOCALES.ENGLISH}>English</MenuItem>
      </Select>
    </FormControl>
  );
};
