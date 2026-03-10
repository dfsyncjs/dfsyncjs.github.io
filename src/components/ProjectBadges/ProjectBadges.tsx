import { Stack, Box, Link } from '@mui/material';

const packageName = '@dfsync/client';
const repoName = 'dfsyncjs/dfsync';

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

      {/* npm weekly downloads */}
      <Link
        href={`https://www.npmjs.com/package/${packageName}`}
        target="_blank"
        rel="noreferrer"
        underline="none"
        sx={{ lineHeight: 1 }}
      >
        <Box
          component="img"
          src={`https://img.shields.io/npm/dw/${encodeURI(packageName)}`}
          alt="npm downloads"
          sx={{ height: 20 }}
        />
      </Link>

      {/* github stars */}
      <Link
        href={`https://github.com/${repoName}/tree/main/packages/client`}
        target="_blank"
        rel="noreferrer"
        underline="none"
        sx={{ lineHeight: 1 }}
      >
        <Box
          component="img"
          src={`https://img.shields.io/github/stars/${repoName}`}
          alt="github stars"
          sx={{ height: 20 }}
        />
      </Link>

      <Box
        component="img"
        src={`https://img.shields.io/github/license/${repoName}`}
        alt="license"
        sx={{ height: 20 }}
      />
    </Stack>
  );
};
