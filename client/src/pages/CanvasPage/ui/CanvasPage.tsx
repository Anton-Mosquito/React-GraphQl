import { Box } from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { getUserAuthData } from '@/entities/User';
import { Canvas, Toolbar } from '@/features/canvas';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';

const CanvasPage = () => {
  const dispatch = useAppDispatch();
  const user = useSelector(getUserAuthData);
  const username = user?.email || 'Anonymous';
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Toolbar />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto',
        }}
      >
        <Canvas sessionId={sessionId} username={username} />
      </Box>
    </Box>
  );
};

export default CanvasPage;
