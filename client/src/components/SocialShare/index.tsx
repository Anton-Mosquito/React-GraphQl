import Stack from '@mui/material/Stack';
import React from 'react';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from 'react-share';

import { SOCIAL_BUTTON_SIZE } from '../../const';

interface SocialShareProps {
  url?: string;
  title?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url = '', title = '' }) => (
  <Stack direction="row" spacing={1}>
    <FacebookShareButton url={url}>
      <FacebookIcon round size={SOCIAL_BUTTON_SIZE} />
    </FacebookShareButton>

    <TwitterShareButton url={url} title={title}>
      <TwitterIcon size={SOCIAL_BUTTON_SIZE} round />
    </TwitterShareButton>
  </Stack>
);

export default SocialShare;
