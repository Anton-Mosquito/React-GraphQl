import { Box } from '@mui/material';
import { useMemo, useRef } from 'react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { getUserAuthData } from '@/entities/User';
import { Canvas, Toolbar } from '@/features/canvas';
import type { CanvasRef } from '@/features/canvas/model/types/canvas';



interface ToolState {
  tool: 'brush' | 'eraser';
  strokeColor: string;
  lineWidth: number;
}

const CanvasPage = () => {
  const user = useSelector(getUserAuthData);
  const username = user?.email || 'Anonymous';
  const sessionId = useMemo(() => crypto.randomUUID(), []); // Generate unique session ID
  const canvasRef = useRef<CanvasRef>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [toolState, setToolState] = useState<ToolState>({
    tool: 'brush',
    strokeColor: '#000000',
    lineWidth: 5,
  });

  const setColor = (color: string) => {
    setToolState((prev) => ({ ...prev, strokeColor: color }));
  };

  const setLineWidth = (width: number) => {
    setToolState((prev) => ({ ...prev, lineWidth: width }));
  };

  const setTool = (tool: 'brush' | 'eraser') => {
    setToolState((prev) => ({ ...prev, tool }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        selectedColor={toolState.strokeColor}
        setColor={setColor}
        lineWidth={toolState.lineWidth}
        setLineWidth={setLineWidth}
        setTool={setTool}
        onUndo={() => {
          canvasRef.current?.undo();
        }}
        onRedo={() => {
          canvasRef.current?.redo();
        }}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Canvas
          ref={canvasRef}
          sessionId={sessionId}
          username={username}
          strokeColor={toolState.strokeColor}
          lineWidth={toolState.lineWidth}
          onStackChange={(canUndoVal, canRedoVal) => {
            setCanUndo(canUndoVal);
            setCanRedo(canRedoVal);
          }}
        />
      </Box>
    </Box>
  );
};

export default CanvasPage;
