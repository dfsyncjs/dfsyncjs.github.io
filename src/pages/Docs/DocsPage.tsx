import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Box,
  CircularProgress,
  Container,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { defaultDocsSlug, defaultDocsVersion, docsNavigation } from '../../content/docsNavigation';
import { docsContent } from '../../content/docsContent';
import { Footer, Header } from '../../components';

export function DocsPage() {
  const { version = defaultDocsVersion, slug = defaultDocsSlug } = useParams();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const normalizedVersion = useMemo(
    () => (version in docsContent ? version : defaultDocsVersion),
    [version],
  );

  const currentVersionDocs = docsContent[normalizedVersion as keyof typeof docsContent];

  const normalizedSlug = useMemo(
    () => (slug && slug in currentVersionDocs ? slug : defaultDocsSlug),
    [slug, currentVersionDocs],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadDoc() {
      setLoading(true);

      const importer = currentVersionDocs[normalizedSlug as keyof typeof currentVersionDocs];

      const module = await importer();

      if (isMounted) {
        setContent(module.default);
        setLoading(false);
      }
    }

    void loadDoc();

    return () => {
      isMounted = false;
    };
  }, [currentVersionDocs, normalizedSlug]);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
          <Paper
            variant="outlined"
            sx={{
              width: { xs: '100%', md: 280 },
              position: { md: 'sticky' },
              top: 96,
              p: 1,
              borderRadius: 1,
            }}
          >
            <Typography sx={{ px: 2, py: 1.5, fontWeight: 700 }}>Docs</Typography>

            <List disablePadding>
              {docsNavigation.map((item) => {
                const to = `/docs/${normalizedVersion}/${item.slug}`;
                const isActive = item.slug === normalizedSlug;

                return (
                  <ListItemButton
                    key={item.slug}
                    component={RouterLink}
                    to={to}
                    selected={isActive}
                    sx={{ borderRadius: 2, mx: 1, mb: 0.5 }}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                );
              })}
            </List>
          </Paper>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <Box
                sx={{
                  minHeight: 240,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    '& h1': {
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      lineHeight: 1.1,
                      mt: 0,
                      mb: 2,
                    },
                    '& h2': {
                      fontSize: '1.5rem',
                      mt: 4,
                      mb: 1.5,
                    },
                    '& p': {
                      color: 'text.secondary',
                      lineHeight: 1.8,
                      mb: 2,
                    },
                    '& ul': {
                      color: 'text.secondary',
                      pl: 3,
                    },
                    '& li': {
                      mb: 1,
                    },
                    '& pre': {
                      overflowX: 'auto',
                      p: 2,
                      borderRadius: 1,
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                      mb: 3,
                    },

                    '& pre code': {
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      fontSize: 14,
                      lineHeight: 1.7,
                      backgroundColor: 'transparent',
                      padding: 0,
                      borderRadius: 0,
                      border: 'none',
                    },

                    '& code': {
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      fontSize: '0.9em',
                      px: 0.75,
                      py: 0.25,
                      borderRadius: 0.5,
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                    },
                    '& table': {
                      width: '100%',
                      borderCollapse: 'collapse',
                      mb: 3,
                      overflow: 'hidden',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                    },
                    '& thead': {
                      bgcolor: 'background.default',
                    },
                    '& th': {
                      textAlign: 'left',
                      px: 2,
                      py: 1.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      fontWeight: 700,
                    },
                    '& td': {
                      px: 2,
                      py: 1.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      color: 'text.secondary',
                      verticalAlign: 'top',
                    },
                    '& tr:last-of-type td': {
                      borderBottom: 'none',
                    },
                    '& a': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </Box>
              </Paper>
            )}
          </Box>
        </Stack>
      </Container>
      <Footer />
    </>
  );
}
