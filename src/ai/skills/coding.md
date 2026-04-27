# Code Quality Best Practices

## Before Making Any Change
- Always read the file first with read_file. Never guess at code structure.
- Use list_files to understand the project layout before diving in.
- When debugging, read ALL files involved before touching anything.

## Making Edits Safely
- Make the smallest possible change that fixes the problem.
- Never rewrite a whole file when you can target specific lines.
- Each edit in edit_file must be a precise search/replace. The old_text must match exactly, including whitespace.
- If old_text might appear multiple times, include surrounding lines for uniqueness.
- Prefer multiple small edits over one big one.

## TypeScript / JavaScript
- Always handle null and undefined. Use optional chaining (?.) and nullish coalescing (??) instead of assumptions.
- Prefer const over let. Never use var.
- Add proper return types to functions.
- Handle promise rejections. Async functions should have try/catch.
- Avoid any type unless absolutely necessary. Use unknown and narrow it.
- Use early returns to avoid deep nesting.
- Keep functions small and focused on one thing.

## Error Handling
- Never swallow errors silently. At minimum log them.
- Show user-friendly messages, not raw error objects.
- Validate inputs before processing.
- Fail fast: check preconditions at the top of functions.

## CSS / Styling
- Use CSS custom properties (variables) for colors and spacing.
- Mobile-first: start with mobile layout, add desktop with media queries.
- Avoid fixed pixel heights on containers. Use flex/grid with min-height: 0.
- Use overflow: hidden on flex parents and overflow: auto on scrollable children.

## React / Frontend Components
- Keep components small. If a component is over 150 lines, split it.
- Lift state only as high as necessary.
- Memoize expensive computations.
- Always cleanup event listeners and subscriptions in useEffect return.
- Use semantic HTML elements.

## API Integration
- Always validate API responses before using them.
- Handle network errors gracefully.
- Show loading states during async operations.
- Never hardcode API keys. Always use environment variables or user settings.

## Git / Code Organization
- One function = one responsibility.
- Names should explain intent, not implementation.
- If you need a comment to explain what code does, consider renaming instead.
- Delete dead code. Don't comment it out.
