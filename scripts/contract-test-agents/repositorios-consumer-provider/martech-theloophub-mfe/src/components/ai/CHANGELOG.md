# Changelog

## [2026-03-11]

### Improvements
- Conversation history now supports infinite scroll pagination in Sidebar
- Delete confirmation modal cancel button uses correct outline style
- Chat stays pinned to bottom during streaming — content grows upward instead of scrolling away
- Scroll now reliably reaches the actual bottom of the conversation

### Fixes
- Error state no longer appears while loading more conversations
- User's sent message no longer disappears when returning to a conversation with an active response
- Fixed scroll container detection for proper auto-scroll behavior

## [2026-03-10]

### New
- General error state blocks the chat when both WebSocket and API are unreachable
- Retry buttons for Sidebar history, FAQs and Smart Flows on individual failures
- Streaming indicator shows when returning to a conversation with an active request

### Improvements
- Messages persist when switching conversations while a response is streaming
- WebSocket subscription stays alive during navigation so responses are not lost
- Extracted reusable helpers: `processStreamEvent`, `isStaleAction`, `detectFailedQuery`

### Fixes
- Messages no longer disappear when switching between conversations mid-stream
- Retry button now shows loading spinner during refetch
- Error state no longer flickers when retrying history
- `listConversationsService` now throws on error for proper RTK Query error handling

## [2026-03-09]

### New
- Added sidebar navigation to AI Chat UI examples page with category-based browsing (Atoms, Molecules, Organisms, Playground)
- Added `dropDirection` prop to Select component (`'up' | 'down'`, default `'up'`)

### Improvements
- Migrated BottomBar from CSS Modules to Emotion
- Migrated ChatAIUIExample from CSS to Emotion
- Simplified DrawerExample to show minimal content
- Adjusted Sidebar conversation list dropdown styling

### Fixes
- Fixed unit tests for InsightsCopilot trigger text and BottomBar disclaimer text

## [2026-03-06]

### New
- Added DeleteModal for conversation deletion confirmation

### Improvements
- Migrated Drawer from CSS Modules to Emotion (consistent with other AI components)
- Added Sparkles icon to Drawer trigger with "One Way Copilot" label
- Redesigned checkbox to match Figma specs (larger, SVG checkmark, new tokens)
- Updated FeedbackModal textarea styling to match design specs
- Updated disabled button appearance with proper design tokens
- Modal footer spacing and layout adjustments
- DeleteModal updated to match design specs — Barlow 24px title, outline cancel button, 400px width

### Fixes
- Feedback modal and sidebar now reset properly when closing the drawer
- Negative feedback requires at least one checkbox selection before submitting
- Button text alignment fixed (no longer slightly off-center)

## [2026-03-05]

### New
- Added visual notification (toast) when submitting feedback in chat, with success or error confirmation

### Improvements
- Updated modal dialog design — larger rounded corners, more spacing, improved shadow and close button styling
