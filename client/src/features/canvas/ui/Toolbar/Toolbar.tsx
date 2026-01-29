import {
  Palette,
  Brush,
  Undo,
  Redo,
  BlurOn,
  FlashOn,
  MoreHoriz,
  Texture,
  Gradient,
} from '@mui/icons-material';
import { Paper, IconButton, Slider, Button, Box, Typography } from '@mui/material';
import { type ChangeEvent } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';

import { selectCanUndo, selectCanRedo } from '../../model/selectors/canvasSelectors';
import {
  selectStrokeColor,
  selectLineWidth,
  selectSelectedTool,
} from '../../model/selectors/toolsSelectors';
import { undo, redo } from '../../model/slices/canvasSlice';
import { setStrokeColor, setLineWidth, setTool } from '../../model/slices/toolsSlice';

export const Toolbar = () => {
  const dispatch = useAppDispatch();

  const selectedColor = useSelector(selectStrokeColor);
  const lineWidth = useSelector(selectLineWidth);
  const selectedTool = useSelector(selectSelectedTool);
  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setStrokeColor(event.target.value));
    dispatch(setTool('brush'));
  };

  const handleToolSelect = (tool: string) => {
    dispatch(setTool(tool));
  };

  const handleEraser = () => {
    dispatch(setStrokeColor('#FFFFFF'));
    dispatch(setTool('eraser'));
  };

  const handleUndo = () => {
    dispatch(undo());
  };

  const handleRedo = () => {
    dispatch(redo());
  };

  const handleSetLineWidth = (width: number) => {
    dispatch(setLineWidth(width));
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
          onChange={(_, value) => handleSetLineWidth(value as number)}
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

      {/* Drawing Tools */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Tools:
        </Typography>

        <IconButton
          onClick={() => handleToolSelect('brush')}
          color={selectedTool === 'brush' ? 'primary' : 'default'}
          sx={{
            bgcolor: selectedTool === 'brush' ? 'primary.main' : 'transparent',
            color: selectedTool === 'brush' ? 'white' : 'inherit',
            '&:hover': {
              bgcolor: selectedTool === 'brush' ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          <Brush />
        </IconButton>

        <IconButton
          onClick={() => handleToolSelect('spray')}
          color={selectedTool === 'spray' ? 'primary' : 'default'}
          sx={{
            bgcolor: selectedTool === 'spray' ? 'primary.main' : 'transparent',
            color: selectedTool === 'spray' ? 'white' : 'inherit',
            '&:hover': {
              bgcolor: selectedTool === 'spray' ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          <BlurOn />
        </IconButton>

        <IconButton
          onClick={() => handleToolSelect('glow')}
          color={selectedTool === 'glow' ? 'primary' : 'default'}
          sx={{
            bgcolor: selectedTool === 'glow' ? 'primary.main' : 'transparent',
            color: selectedTool === 'glow' ? 'white' : 'inherit',
            '&:hover': {
              bgcolor: selectedTool === 'glow' ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          <FlashOn />
        </IconButton>

        <IconButton
          onClick={() => handleToolSelect('dashed')}
          color={selectedTool === 'dashed' ? 'primary' : 'default'}
          sx={{
            bgcolor: selectedTool === 'dashed' ? 'primary.main' : 'transparent',
            color: selectedTool === 'dashed' ? 'white' : 'inherit',
            '&:hover': {
              bgcolor: selectedTool === 'dashed' ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          <MoreHoriz />
        </IconButton>

        <IconButton
          onClick={() => handleToolSelect('textured')}
          color={selectedTool === 'textured' ? 'primary' : 'default'}
          sx={{
            bgcolor: selectedTool === 'textured' ? 'primary.main' : 'transparent',
            color: selectedTool === 'textured' ? 'white' : 'inherit',
            '&:hover': {
              bgcolor: selectedTool === 'textured' ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          <Texture />
        </IconButton>

        <IconButton
          onClick={() => handleToolSelect('gradient')}
          color={selectedTool === 'gradient' ? 'primary' : 'default'}
          sx={{
            bgcolor: selectedTool === 'gradient' ? 'primary.main' : 'transparent',
            color: selectedTool === 'gradient' ? 'white' : 'inherit',
            '&:hover': {
              bgcolor: selectedTool === 'gradient' ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          <Gradient />
        </IconButton>
      </Box>

      <IconButton onClick={handleUndo} disabled={!canUndo}>
        <Undo />
      </IconButton>
      <IconButton onClick={handleRedo} disabled={!canRedo}>
        <Redo />
      </IconButton>
    </Paper>
  );
};
