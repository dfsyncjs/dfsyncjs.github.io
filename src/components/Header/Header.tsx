import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedIn from '@mui/icons-material/LinkedIn';
import { AppBar, Box, Button, Container, Toolbar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Brand } from '../Brand/Brand';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { createTrackedLinkHandler } from '../../services/analytics';
import { APP_HEADER_HEIGHT } from '../../app/layout';

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
        <Toolbar
          disableGutters
          sx={{ minHeight: APP_HEADER_HEIGHT, gap: 2, justifyContent: 'space-between' }}
        >
          <Brand />
          <Box sx={{ flexShrink: 0 }}>
            <Button
              component={RouterLink}
              to="/docs"
              color="inherit"
              onClick={createTrackedLinkHandler({
                params: {
                  cta_name: 'docs',
                  location: 'header',
                  label: 'Docs',
                  link_url: '/docs',
                },
              })}
            >
              Docs
            </Button>
            <Button
              color="inherit"
              href="https://github.com/dfsyncjs/dfsync"
              target="_blank"
              rel="noreferrer"
              startIcon={<GitHubIcon />}
              onClick={createTrackedLinkHandler({
                params: {
                  cta_name: 'github',
                  location: 'header',
                  label: 'GitHub',
                  link_url: 'https://github.com/dfsyncjs/dfsync',
                },
              })}
            >
              GitHub
            </Button>
            <Button
              color="inherit"
              href="https://www.linkedin.com/company/dfsync/"
              target="_blank"
              rel="noreferrer"
              startIcon={<LinkedIn />}
              onClick={createTrackedLinkHandler({
                params: {
                  cta_name: 'linkedIn',
                  location: 'header',
                  label: 'LinkedIn',
                  link_url: 'https://www.linkedin.com/company/dfsync/',
                },
              })}
            >
              LinkedIn
            </Button>
            <ThemeToggle />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
