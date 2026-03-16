import GitHubIcon from '@mui/icons-material/GitHub';
import { AppBar, Box, Button, Container, Toolbar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Brand } from '../Brand/Brand';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';

export const Header = () => {
  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 72, gap: 2, justifyContent: 'space-between' }}>
          <Brand />
          <Box sx={{ flexShrink: 0 }}>
            <Button component={RouterLink} to="/docs" color="inherit">
              Docs
            </Button>
            <Button
              color="inherit"
              href="https://www.npmjs.com/package/@dfsync/client"
              target="_blank"
              rel="noreferrer"
            >
              npm
            </Button>
            <Button
              color="inherit"
              href="https://github.com/dfsyncjs/dfsync"
              target="_blank"
              rel="noreferrer"
              startIcon={<GitHubIcon />}
            >
              GitHub
            </Button>
            <ThemeToggle />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
