import { Stack, Box, Link } from '@mui/material';

const packageName = '@dfsync/client';

export const ProjectBadges = () => {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ mt: 2 }}>
      {/* npm version */}
      <Link
        href={`https://www.npmjs.com/package/${packageName}`}
        target="_blank"
        rel="noreferrer"
        underline="none"
        sx={{ lineHeight: 1 }}
      >
        <Box
          component="img"
          src={`https://img.shields.io/npm/v/${encodeURI(packageName)}`}
          alt="npm version"
          sx={{ height: 20 }}
        />
      </Link>

      {/* npm downloads */}
      <Link
        href={`https://www.npmjs.com/package/${packageName}`}
        target="_blank"
        rel="noreferrer"
        underline="none"
        sx={{ lineHeight: 1 }}
      >
        <Box
          component="img"
          src={`https://img.shields.io/npm/dm/${encodeURI(packageName)}`}
          alt="npm downloads"
          sx={{ height: 20 }}
        />
      </Link>
    </Stack>
  );
};
