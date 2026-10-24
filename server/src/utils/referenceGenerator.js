import crypto from 'crypto';
import { query } from '../db/connection.js';

/**
 * Generate a unique, customer-friendly feedback reference: PAP-FB-XXXXXX
 */
export async function generateUniqueFeedbackRef() {
  let isUnique = false;
  let reference = '';

  while (!isUnique) {
    // Generate a 6-digit random number or uppercase alphanumeric
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    reference = `PAP-FB-${randomCode}`;

    const existing = await query(
      'SELECT id FROM survey_responses WHERE feedback_ref = ? LIMIT 1;',
      [reference]
    );

    if (existing.length === 0) {
      isUnique = true;
    }
  }

  return reference;
}
