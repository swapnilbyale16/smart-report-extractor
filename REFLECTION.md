# AI Reflection Log

## Tools Used
- Claude (claude.ai) — primary AI assistant throughout the build

---

## Where AI Helped

### 1. Project scaffold and folder structure
Prompted Claude to plan the full architecture before writing any code.
It produced the folder structure, file responsibilities, and the idea of
isolating the LLM as a separate service. Used this directly — it was
well-reasoned and matched how I'd structure a production service.

### 2. Regex extractors for each document type
Asked Claude to generate field extraction logic for Invoice, Bank Statement,
Resume, and Medical Report. It produced working regex patterns for most fields.
Used as a starting point, then tested against real PDFs and adjusted patterns
that were too greedy (e.g. patientName was capturing hospital name too).

### 3. Format detection logic
Claude suggested a scoring-based approach — count keyword matches per format,
pick the highest scorer, require a minimum of 2 matches to avoid false positives.
This was better than my initial idea of single-keyword matching. Used it directly.

### 4. Gemini API integration
Claude generated the fetch-based LLM call and the fallback summary function.
The structure was correct. Used directly after verifying the endpoint and model name.

### 5. React frontend components
Claude generated the UploadSection and ResultSection components.
Used directly with minor style tweaks. The drag-and-drop integration with
react-dropzone worked first time.

---

## Where AI Was Wrong or Incomplete

### 1. pdf-parse ESM import — had to fix
Claude initially suggested `import pdfParse from 'pdf-parse'` which failed
because pdf-parse does not support ES modules.
Claude then suggested `import pdfParse from 'pdf-parse/lib/pdf-parse.js'`
which also failed with ERR_PACKAGE_PATH_NOT_EXPORTED.
Eventually switched to pdfjs-dist with `import * as pdfjsLib` and added
`new Uint8Array(buffer)` conversion — this I had to debug myself by reading
the actual error messages carefully.

### 2. Duplicate res.json() in extract.js
Claude left both the new stateless response AND the old MongoDB response in
the route file when I asked it to remove MongoDB. This caused a
"Cannot set headers after they are sent" crash.
I caught this by reading the error and inspecting the file manually.

### 3. Gemini model names were outdated
Claude suggested gemini-1.5-flash and gemini-pro — both returned 404.
Had to manually call the ListModels API endpoint to find the correct
available model (gemini-2.0-flash) for my account and region.

### 4. Missing comma in package.json
Claude told me to add "type": "module" but didn't show the comma needed
after it. Small thing but caused a JSON parse error. Fixed it myself.

### 5. Skills extraction was empty initially
Claude's regex for skills used a section-header approach that didn't match
my resume format. I replaced it with a keyword-matching approach —
checking for known tech keywords directly in the text — which worked reliably
across different resume formats.

---

## Summary

AI was most useful for boilerplate, structure, and getting a working first
draft quickly. It saved significant time on repetitive patterns like the
extractors and the React components.

The areas where I had to override AI were mostly around environment-specific
issues — ESM compatibility, deprecated API model names, and subtle bugs from
copy-paste across multiple edits. These required reading actual error output
and reasoning through the fix independently.

The LLM-as-isolated-service pattern was AI-suggested and is something I'd
use in production — it made the fallback handling clean and kept the rest of
the app decoupled from LLM availability.