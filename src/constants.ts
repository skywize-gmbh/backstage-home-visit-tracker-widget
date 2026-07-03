/**
 * Entity kinds shown by the "Top Visited" and "Recently Visited" widgets by
 * default. Consumers can override this per-widget via the `allowedKinds` prop.
 */
export const DEFAULT_KINDS = [
  'Component',
  'API',
  'System',
  'Domain',
  'Resource',
  'Template',
];

/** Default number of rows rendered by each visited-entities widget. */
export const DEFAULT_LIMIT = 5;
