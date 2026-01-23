import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { CONFIRM_TIMEOUT } from '../../const';
import SocialShare from '../SocialShare';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface ConfirmModalProps {
  open?: boolean;
  url?: string;
  title?: string;
  onClose?: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open = false,
  url = '',
  title = '',
  onClose,
}) => {
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (openAlert) {
      timer = setTimeout(() => {
        setOpenAlert(false);
      }, CONFIRM_TIMEOUT);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [openAlert]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Paper
          component="form"
          sx={{
            p: '2px 4px',
            marginTop: '24px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="List URL"
            inputProps={{ 'aria-label': 'list URL' }}
            value={url}
          />

          <IconButton sx={{ p: '10px' }} aria-label="preivew" href={url} target="_blank">
            <VisibilityIcon />
          </IconButton>

          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

          <IconButton
            color="primary"
            sx={{ p: '10px' }}
            aria-label="copy to clipboard"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url || '');
                setOpenAlert(true);
              } catch (e) {
                // fallback: no-op
                console.error('Copy failed', e);
              }
            }}
          >
            <ContentCopyIcon />
          </IconButton>
        </Paper>

        <Typography id="modal-modal-title" variant="h6" component="h3">
          <FormattedMessage id="share_with_friends" />
        </Typography>

        <SocialShare url={url} title={title} />

        {openAlert ? (
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setOpenAlert(false)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mt: 2 }}
          >
            <FormattedMessage id="copied" />
          </Alert>
        ) : null}
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
