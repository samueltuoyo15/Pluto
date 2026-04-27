# Refactoring Guidelines

## When to Refactor
- Code is duplicated more than twice
- Function is doing more than one thing
- Variable/function names don't explain intent
- Nesting is deeper than 3 levels
- File is over 300 lines and could be split

## How to Refactor Safely
1. Read the entire file first to understand the full picture.
2. Make one change at a time.
3. Explain what you're doing and why.
4. Keep the same behavior — refactoring should not change functionality.

## Extract Function
When a block of code does one clear thing, extract it:

Bad:
```js
// 20 lines of processing inline
```

Good:
```js
const result = processUserData(rawData);
```

## Naming
- Functions: verbs. getUser(), validateInput(), formatDate()
- Booleans: is/has/can prefix. isLoading, hasError, canSubmit
- Constants: SCREAMING_SNAKE for true constants. MAX_RETRIES, API_URL
- Avoid abbreviations unless they're universal (id, url, api, ctx)

## Simplify Conditionals
Bad:
```js
if (condition === true) {
  return true;
} else {
  return false;
}
```
Good:
```js
return condition;
```

## Avoid Magic Numbers
Bad: `if (status === 403)`
Good: `const FORBIDDEN = 403; if (status === FORBIDDEN)`
