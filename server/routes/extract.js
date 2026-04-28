import express from 'express';
import multer from 'multer';
import { extractTextFromPDF } from '../services/pdfParser.js';
import { detectFormat } from '../services/formatDetector.js';
import { extractInvoiceFields } from '../services/extractors/invoice.js';
import { extractBankStatementFields } from '../services/extractors/bankStatement.js';
import { extractResumeFields } from '../services/extractors/resume.js';
import { extractMedicalFields } from '../services/extractors/medical.js';
import { generateSummary } from '../services/llmService.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(Object.assign(new Error('Only PDF files are accepted'), { status: 422, code: 'INVALID_FILE_TYPE' }));
    }
    cb(null, true);
  }
});

const EXTRACTORS = {
  invoice:        extractInvoiceFields,
  bank_statement: extractBankStatementFields,
  resume:         extractResumeFields,
  medical:        extractMedicalFields,
};

router.post('/', upload.single('pdf'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded', code: 'NO_FILE' });
    }

    const rawText = await extractTextFromPDF(req.file.buffer);
    const reportType = detectFormat(rawText);
    const extractor = EXTRACTORS[reportType];
    const extractedFields = extractor(rawText);
    const summary = await generateSummary(reportType, extractedFields, rawText);

    res.json({
      fileName: req.file.originalname,
      reportType,
      extractedFields,
      summary,
      createdAt: new Date()
    });

  } catch (err) {
    next(err);
  }
});

export default router;