import { Box } from '@mui/material';
import type { FC } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  prefix?: string;
}

export const TabPanel: FC<TabPanelProps> = ({
  children,
  value,
  index,
  prefix = 'tab',
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${prefix}panel-${index}`}
      aria-labelledby={`${prefix}-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};
