import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Box,
  CircularProgress,
  Container,
  FormControl,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  defaultDocsPackage,
  defaultDocsSlug,
  defaultDocsVersion,
} from '../../content/docsNavigation';
import { docsPackages } from '../../content/docsContent';
import { Footer, Header } from '../../components';
import { DOCS_SIDEBAR_OFFSET } from '../../app/layout';

export function DocsPage() {
  const navigate = useNavigate();
  const {
    packageSlug = defaultDocsPackage,
    version = defaultDocsVersion,
    slug = defaultDocsSlug,
  } = useParams();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const normalizedPackageSlug = useMemo(
    () => (packageSlug in docsPackages ? packageSlug : defaultDocsPackage),
    [packageSlug],
  );

  const currentPackage = docsPackages[normalizedPackageSlug as keyof typeof docsPackages];

  const normalizedVersion = useMemo(
    () => (version in currentPackage.versions ? version : currentPackage.defaultVersion),
    [version, currentPackage],
  );

  const currentVersionDocs =
    currentPackage.versions[normalizedVersion as keyof typeof currentPackage.versions];

  const normalizedSlug = useMemo(
    () => (slug && slug in currentVersionDocs.content ? slug : currentPackage.defaultSlug),
    [slug, currentVersionDocs, currentPackage.defaultSlug],
  );

  const docsNavigation = currentVersionDocs.navigation;
  const currentDocsContent = currentVersionDocs.content;
  const packageVersions = useMemo(() => Object.keys(currentPackage.versions), [currentPackage]);

  const handleVersionChange = (event: SelectChangeEvent) => {
    const nextVersion = event.target.value;
    const nextVersionDocs =
      currentPackage.versions[nextVersion as keyof typeof currentPackage.versions];

    if (!nextVersionDocs) {
      return;
    }

    const nextSlug =
      normalizedSlug in nextVersionDocs.content ? normalizedSlug : currentPackage.defaultSlug;

    navigate(`/docs/${normalizedPackageSlug}/${nextVersion}/${nextSlug}`);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadDoc() {
      setLoading(true);

      const importer = currentDocsContent[normalizedSlug as keyof typeof currentDocsContent];

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
  }, [currentDocsContent, normalizedSlug]);

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
              top: { md: DOCS_SIDEBAR_OFFSET },
              p: 1,
              borderRadius: 1,
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography sx={{ fontWeight: 700 }}>Docs</Typography>
              <Typography variant="body2" color="text.secondary">
                {currentPackage.label}
              </Typography>

              <FormControl fullWidth size="small" sx={{ mt: 1.5 }}>
                <Select
                  value={normalizedVersion}
                  onChange={handleVersionChange}
                  inputProps={{ 'aria-label': 'Documentation version' }}
                  sx={{
                    borderRadius: 1,
                    '& .MuiSelect-select': {
                      py: 0.75,
                    },
                  }}
                >
                  {packageVersions.map((packageVersion) => (
                    <MenuItem key={packageVersion} value={packageVersion}>
                      {packageVersion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <List disablePadding>
              {docsNavigation.map((item) => {
                const to = `/docs/${normalizedPackageSlug}/${normalizedVersion}/${item.slug}`;
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
