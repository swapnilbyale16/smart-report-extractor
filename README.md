# Smart Report Extractor

An AI-powered PDF analysis service that accepts a PDF document, detects its type, extracts structured fields, and returns a plain-English summary.

Built with the MERN stack (MongoDB-ready, Node.js + Express + React).

---

## Supported Document Types

| Type | Extracted Fields |
|---|---|
| Invoice | Invoice number, date, vendor, bill-to, total, tax, subtotal |
| Bank Statement | Account number, period, opening/closing balance, credits, debits |
| Resume / CV | Email, phone, skills, education, experience, LinkedIn |
| Medical Report | Patient name, DOB, diagnosis, physician, medications, visit date |

---

## Tech Stack

- **Frontend:** React (Vite), react-dropzone
- **Backend:** Node.js, Express
- **PDF Parsing:** pdfjs-dist
- **Format Detection:** Scoring-based keyword matching
- **LLM:** Google Gemini API (gemini-2.0-flash) with graceful fallback
- **Database:** MongoDB-ready via Mongoose (optional, disabled by default)

---

## Project Structure

smart-report-extractor/
├── client/                        # React frontend
│   └── src/
│       ├── components/
│       │   ├── UploadSection.jsx  # Drag & drop PDF upload
│       │   └── ResultSection.jsx  # Extracted fields + summary display
│       └── App.jsx
├── server/                        # Express backend
│   ├── routes/
│   │   └── extract.js             # POST /api/extract
│   ├── services/
│   │   ├── pdfParser.js           # PDF text extraction
│   │   ├── formatDetector.js      # Document type detection
│   │   ├── llmService.js          # Gemini API (isolated, with fallback)
│   │   └── extractors/
│   │       ├── invoice.js
│   │       ├── bankStatement.js
│   │       ├── resume.js
│   │       └── medical.js
│   ├── middleware/
│   │   └── errorHandler.js
│   └── index.js
└── README.md


---

## Setup & Run

### Prerequisites
- Node.js v18+
- A Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/smart-report-extractor.git
cd smart-report-extractor
```

### 2. Setup the server
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the server:
```bash
npm run dev
```

### 3. Setup the client
```bash
cd ../client
npm install
npm run dev
```

### 4. Open the app
Visit `http://localhost:5173` in your browser.

---

## API

### `POST /api/extract`

Upload a PDF file for extraction.

**Request:** `multipart/form-data` with field `pdf`

**Response:**
```json
{
  "fileName": "invoice.pdf",
  "reportType": "invoice",
  "extractedFields": {
    "invoiceNumber": "INV-001",
    "totalAmount": "35400"
  },
  "summary": "This invoice from Tech Solutions...",
  "createdAt": "2026-04-28T10:00:00.000Z"
}
```

**Error responses:**
- `400` — No file uploaded
- `422` — Invalid file type / unparseable PDF / unknown format
- `500` — Internal server error

### `GET /api/health`
Returns `{ "status": "ok" }` — used to verify server is running.

---

## LLM Integration

The LLM is treated as an isolated external service in `services/llmService.js`. It is called only for summary generation — not for extraction logic.

If the LLM API is unavailable or returns an error, the service falls back to a structured plain-text summary generated from the extracted fields. The rest of the application continues to work normally.

---

## Notes
- PDFs are processed in memory — never written to disk
- Only `.pdf` files are accepted (validated by MIME type)
- Max file size: 10MB