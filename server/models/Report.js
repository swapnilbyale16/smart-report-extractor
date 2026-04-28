import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  fileName:    { type: String, required: true },
  reportType:  { type: String, required: true }, // invoice | bank_statement | resume | medical
  extractedFields: { type: mongoose.Schema.Types.Mixed, required: true },
  summary:     { type: String, required: true },
  rawTextSnippet: { type: String }, // first 500 chars, useful for debugging
  createdAt:   { type: Date, default: Date.now }
});

export default mongoose.model('Report', reportSchema);