import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import type { PluggableList } from 'unified';

/**
 * Security-hardened sanitization schema for markdown rendering.
 *
 * This schema:
 * - Maintains all custom tags required by the AI (tabgroup, chartsgroup, details, summary, mark)
 * - Enforces strict whitelist of allowed attributes to prevent XSS attacks
 * - Blocks dangerous protocols (javascript:, data: in hrefs)
 * - Removes all event handlers (onclick, onerror, etc)
 * - Prevents ID/name clobbering attacks
 *
 * Security layers:
 * 1. Tag whitelist - only specific tags allowed
 * 2. Attribute whitelist - only safe attributes per tag
 * 3. Protocol whitelist - only http/https/mailto/tel
 * 4. Event handler blocking - no on* attributes
 */
export const sanitizeSchema = {
  ...defaultSchema,

  // Custom tags required for AI markdown rendering
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'details',
    'summary',
    'mark',
    'tabgroup',
    'chartsgroup',
  ],

  // Strict attribute whitelist per tag
  attributes: {
    ...defaultSchema.attributes,

    // Custom tags - minimal attributes for security
    details: ['open'],
    summary: [],
    mark: [],
    tabgroup: [],
    chartsgroup: [],

    // Global attributes - remove event handlers (XSS prevention)
    '*': ['className', 'class', 'id'],
  },

  // Safe URL protocols only
  protocols: {
    href: ['http', 'https', 'mailto', 'tel'],
    src: ['http', 'https', 'data'],
    cite: ['http', 'https'],
  },

  // Prevent DOM clobbering attacks
  clobberPrefix: 'user-',
  clobber: ['name', 'id'],
};

export const REMARK_PLUGINS: PluggableList = [remarkGfm];

export const REHYPE_PLUGINS: PluggableList = [
  rehypeRaw,
  [rehypeSanitize, sanitizeSchema],
];
