import { docsPackages, type DocsPackageSlug } from './docsContent';

export const defaultDocsPackage = 'client' satisfies DocsPackageSlug;
export const defaultDocsVersion = docsPackages[defaultDocsPackage].defaultVersion;
export const defaultDocsSlug = docsPackages[defaultDocsPackage].defaultSlug;

export const docsNavigation =
  docsPackages[defaultDocsPackage].versions[defaultDocsVersion].navigation;
