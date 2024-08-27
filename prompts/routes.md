# Routes Documentation

## Excluding Routes from Sitemap

In some cases, you might want to exclude certain routes from being included in your sitemap. This can be useful for routes that contain sensitive information, admin pages, or any other pages that you do not want to be indexed by search engines.

### Example

Consider the following route configuration for a profile settings page:

```typescript
typescript:app/routes/settings+/profile.tsx
export const handle: BreadcrumbHandle & SEOHandle = {
breadcrumb: <Icon name="file-text">Edit Profile</Icon>,
getSitemapEntries: () => null, // Exclude this route from the sitemap
}
```

### Steps to Exclude a Route

1. **Define the `handle` Object**: Ensure your route file exports a `handle` object that implements the `SEOHandle` interface.
2. **Set `getSitemapEntries` to `null`**: Within the `handle` object, set the `getSitemapEntries` function to return `null`.

### Full Example

Here is a complete example of a route file that excludes itself from the sitemap:

```typescript:app/routes/settings+/profile.tsx
import { Icon } from 'some-icon-library';
import { BreadcrumbHandle, SEOHandle } from 'some-seo-library';

export const handle: BreadcrumbHandle & SEOHandle = {
  breadcrumb: <Icon name="file-text">Edit Profile</Icon>,
  getSitemapEntries: () => null, // Exclude this route from the sitemap
}
```
