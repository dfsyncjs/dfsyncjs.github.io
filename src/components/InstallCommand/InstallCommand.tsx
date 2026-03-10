import { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { IconButton, Stack, Typography } from '@mui/material';

export const InstallCommand = () => {
  const [copied, setCopied] = useState(false);

  const command = 'npm install @dfsync/client';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        px: 3,
        py: 2,
        maxWidth: 500,
      }}
    >
      <Typography
        sx={{
          fontFamily: 'monospace',
          fontSize: 14,
        }}
      >
        {command}
      </Typography>

      <IconButton size="small" onClick={handleCopy}>
        {copied ? <CheckIcon /> : <ContentCopyIcon />}
      </IconButton>
    </Stack>
  );
};
