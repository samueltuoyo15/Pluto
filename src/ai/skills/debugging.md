# Debugging Workflow

## Step 1: Understand Before Touching
1. Read the file with the error first.
2. Read any imports or dependencies that are relevant.
3. Understand what the code is supposed to do before deciding what's wrong.
4. Don't assume the bug is where the error message says it is — trace it back to the root cause.

## Step 2: Identify the Root Cause
- Ask: what is the actual expected behavior vs what is happening?
- Look for: null/undefined access, off-by-one errors, wrong assumptions about async timing, type mismatches.
- Read error messages carefully. They usually point directly at the problem.

## Step 3: Fix Minimally
- Fix the root cause, not the symptom.
- Don't add workaround hacks. Fix the real issue.
- Make the change, explain what you changed and why in one sentence.

## Step 4: Verify
- After editing, mentally trace through the code path again.
- Check if the fix could break anything else.
- If you're unsure, mention it to the user.

## Common Bugs to Watch For
- Missing await on async functions
- Accessing .length or .map on potentially null/undefined values
- setState being called after component unmount
- Event listeners added but never removed
- Missing error handling in fetch/axios calls
- parseInt without radix (always use parseInt(x, 10))
- Mutating objects/arrays directly instead of creating copies
- useEffect missing dependency array (runs every render)
- CSS: forgetting overflow on scrollable containers
