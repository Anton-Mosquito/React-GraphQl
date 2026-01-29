import { Palette, Brush, Undo, Redo } from '@mui/icons-material';
import { Paper, IconButton, Slider, Button, Box, Typography } from '@mui/material';
import { type FC } from 'react';

import type { ToolbarProps } from '../../model/types/canvas';

export const Toolbar: FC<ToolbarProps> = ({
  selectedColor,
  setColor,
  lineWidth,
  setLineWidth,
  setTool,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
    setTool('brush');
  };

  const handleEraser = () => {
    setColor('#FFFFFF');
    setTool('eraser');
  };

  return (
    <Paper
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'white',
        borderBottom: '1px solid #ccc',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Palette />
        <input
          type="color"
          value={selectedColor}
          onChange={handleColorChange}
          style={{
            width: 40,
            height: 40,
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
        <Brush />
        <Typography variant="body2">Width:</Typography>
        <Slider
          value={lineWidth}
          onChange={(_, value) => setLineWidth(value as number)}
          min={1}
          max={50}
          step={1}
          sx={{ flexGrow: 1 }}
        />
        <Typography variant="body2">{lineWidth}px</Typography>
      </Box>

      <Button
        variant="outlined"
        startIcon={<Brush />}
        onClick={handleEraser}
        sx={{ minWidth: 100 }}
      >
        Eraser
      </Button>

      {/* Undo/Redo */}
      <IconButton onClick={onUndo} disabled={!canUndo}>
        <Undo />
      </IconButton>
      <IconButton onClick={onRedo} disabled={!canRedo}>
        <Redo />
      </IconButton>
    </Paper>
  );
};
