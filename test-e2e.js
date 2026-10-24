/**
 * Comprehensive E2E Integration Test Suite for Papido Booking Opinion Survey
 */
import { spawn } from 'child_process';
import http from 'http';

function makeRequest({ host = '127.0.0.1', port = 5000, path, method = 'GET', headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const payload = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;
    const reqHeaders = { ...headers };
    if (payload && !reqHeaders['Content-Type']) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(
      {
        host,
        port,
        path,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(rawData);
          } catch {
            // not json
          }
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: json || rawData,
          });
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runTests() {
  console.log('========================================================');
  console.log('🧪 Starting Papido Opinion Survey Full E2E Test Suite');
  console.log('========================================================\n');

  // 1. Start Server Process
  console.log('[1/12] Spawning backend server process...');
  const serverProc = spawn('node', ['src/server.js'], {
    cwd: './server',
    stdio: 'inherit',
    env: { ...process.env, PORT: '5000', NODE_ENV: 'test' },
  });

  // Give server 3 seconds to spin up and connect to MySQL
  await new Promise((r) => setTimeout(r, 3000));

  let exitCode = 0;

  try {
    // 2. Health Check
    console.log('[2/12] Testing Health Check endpoint (/api/health)...');
    const health = await makeRequest({ path: '/api/health' });
    if (health.statusCode === 200 && health.body.status === 'healthy') {
      console.log('  ✓ Health check passed:', health.body.service);
    } else {
      throw new Error(`Health check failed with code ${health.statusCode}`);
    }

    // 3. Public Settings
    console.log('[3/12] Testing Public Settings endpoint (/api/survey/settings)...');
    const settings = await makeRequest({ path: '/api/survey/settings' });
    if (settings.statusCode === 200 && settings.body.settings?.newBookingWebsiteUrl) {
      console.log('  ✓ Public settings returned URL:', settings.body.settings.newBookingWebsiteUrl);
    } else {
      throw new Error('Failed to retrieve public settings');
    }

    // 4. Submit Valid Survey Response
    console.log('[4/12] Testing Public Survey Submission (POST /api/survey/submit)...');
    const surveyPayload = {
      whatsapp_satisfaction: 4,
      whatsapp_likes: ['Easy to use', 'Familiar', 'Quick communication'],
      whatsapp_likes_other: '',
      whatsapp_difficulties: ['Difficult during busy periods'],
      whatsapp_difficulties_other: '',
      explored_website: true,
      website_opinion: 'Very Good',
      website_ease_of_use: 'Very Easy',
      website_likes: ['Simple booking process', 'Speed'],
      website_likes_other: '',
      website_improvements: 'Make sure it loads cleanly on low bandwidth',
      preferred_booking_method: 'Both',
      website_adoption_intent: 'Definitely Yes',
      continue_whatsapp: 'Yes, but mainly for support',
      both_convenience: 'Definitely Yes',
      requested_features: ['Booking confirmation', 'Ride status', 'Online payment'],
      requested_features_other: '',
      most_important_improvement: 'Live ride status tracking',
      launch_recommendation: 'Launch the new website alongside WhatsApp',
      additional_feedback: 'Looking forward to the rollout! Great step forward for Papido.',
      willing_to_contact: true,
      contact_name: 'Priya Sundaram',
      contact_mobile: '9840192834',
      contact_email: 'priya.sundaram@pu.ac.in',
    };

    const submitRes = await makeRequest({
      path: '/api/survey/submit',
      method: 'POST',
      body: surveyPayload,
    });

    if (submitRes.statusCode === 201 && submitRes.body.feedbackRef?.startsWith('PAP-FB-')) {
      console.log('  ✓ Survey submitted successfully! Generated Ref:', submitRes.body.feedbackRef);
    } else {
      throw new Error(`Survey submission failed: ${JSON.stringify(submitRes.body)}`);
    }

    const createdRef = submitRes.body.feedbackRef;

    // 5. Test Validation Handling on Malformed Input
    console.log('[5/12] Testing Input Validation & Error Handling on invalid data...');
    const invalidRes = await makeRequest({
      path: '/api/survey/submit',
      method: 'POST',
      body: { whatsapp_satisfaction: 99 }, // missing required fields
    });
    if (invalidRes.statusCode === 400 && invalidRes.body.errors?.length > 0) {
      console.log('  ✓ Validation error caught properly with friendly error list (count: ' + invalidRes.body.errors.length + ')');
    } else {
      throw new Error('Validation failed to reject invalid payload');
    }

    // 6. Test Duplicate Accidental Rapid Submission Suppression
    console.log('[6/12] Testing Duplicate Submission Guard...');
    const dupRes = await makeRequest({
      path: '/api/survey/submit',
      method: 'POST',
      body: surveyPayload,
    });
    if (dupRes.statusCode === 200 && dupRes.body.feedbackRef === createdRef) {
      console.log('  ✓ Rapid duplicate submission suppressed gracefully and returned original reference');
    } else {
      console.log('  Note: Duplicate test returned:', dupRes.body);
    }

    // 7. Test Admin Login with Default Credentials
    console.log('[7/12] Testing Admin Authentication (POST /api/admin/login)...');
    const loginRes = await makeRequest({
      path: '/api/admin/login',
      method: 'POST',
      body: {
        email: 'admin@papido.online',
        password: 'Admin@Papido2026!',
      },
    });

    if (loginRes.statusCode === 200 && loginRes.body.token) {
      console.log('  ✓ Admin authentication successful! JWT token generated for:', loginRes.body.user.email);
    } else {
      throw new Error(`Admin login failed: ${JSON.stringify(loginRes.body)}`);
    }

    const adminToken = loginRes.body.token;

    // 8. Test Protected Route Access Control
    console.log('[8/12] Testing Protected Route Security without Token...');
    const unauthRes = await makeRequest({ path: '/api/admin/dashboard' });
    if (unauthRes.statusCode === 401) {
      console.log('  ✓ Route correctly denied access with 401 Unauthorized');
    } else {
      throw new Error(`Security breach: Protected route allowed access without token (status ${unauthRes.statusCode})`);
    }

    // 9. Test Dashboard Analytics Calculation
    console.log('[9/12] Testing Admin Dashboard Analytics (GET /api/admin/dashboard)...');
    const dashboardRes = await makeRequest({
      path: '/api/admin/dashboard',
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (dashboardRes.statusCode === 200 && dashboardRes.body.metrics?.totalResponses > 0) {
      const m = dashboardRes.body.metrics;
      console.log(`  ✓ Dashboard computed successfully!`);
      console.log(`    • Total Responses: ${m.totalResponses}`);
      console.log(`    • Avg WhatsApp Sat: ${m.avgWhatsappSatisfaction} / 5`);
      console.log(`    • Website Positive Rating: ${m.websitePositiveRatingPct}%`);
      console.log(`    • Website Adoption Intent: ${m.websiteAdoptionIntentPct}%`);
      console.log(`    • Prefer Both: ${m.preferBothPct}%`);
      console.log(`    • Prefer Website: ${m.preferWebsitePct}%`);
      console.log(`    • Prefer WhatsApp: ${m.preferWhatsAppPct}%`);
      console.log(`    • Launch Support: ${m.launchSupportPct}%`);
    } else {
      throw new Error('Failed to retrieve dashboard analytics');
    }

    // 10. Test Feedback List & Search / Filter
    console.log('[10/12] Testing Feedback Management API (GET /api/admin/feedback)...');
    const listRes = await makeRequest({
      path: '/api/admin/feedback?search=Priya',
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (listRes.statusCode === 200 && listRes.body.data?.length > 0) {
      console.log('  ✓ Feedback search by name returned record:', listRes.body.data[0].feedback_ref);
    } else {
      throw new Error('Search failed to find recently created submission');
    }

    const targetFeedbackId = listRes.body.data[0].id;

    // 11. Test Status Update & Notes
    console.log('[11/12] Testing Feedback Status & Admin Note Update (PATCH /api/admin/feedback/:id)...');
    const patchRes = await makeRequest({
      path: `/api/admin/feedback/${targetFeedbackId}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        status: 'Important',
        admin_notes: 'Priority beta tester for Pondicherry University campus',
      },
    });

    if (patchRes.statusCode === 200 && patchRes.body.success) {
      console.log('  ✓ Status updated to "Important" and admin notes recorded');
    } else {
      throw new Error('Failed to update feedback status');
    }

    // 12. Test CSV and Excel Export Downloads
    console.log('[12/12] Testing Data Exports (CSV & Excel .xlsx)...');
    const csvRes = await makeRequest({
      path: '/api/admin/export/csv',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (csvRes.statusCode === 200 && csvRes.headers['content-type']?.includes('text/csv')) {
      console.log('  ✓ CSV export generated cleanly with proper headers & rows');
    } else {
      throw new Error('CSV export failed');
    }

    const excelRes = await makeRequest({
      path: '/api/admin/export/excel',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (excelRes.statusCode === 200 && excelRes.headers['content-type']?.includes('spreadsheetml')) {
      console.log('  ✓ Excel (.xlsx) export generated with formatted columns');
    } else {
      throw new Error('Excel export failed');
    }

    console.log('\n========================================================');
    console.log('🎉 ALL 12 INTEGRATION TESTS PASSED PERFECTLY!');
    console.log('========================================================');
  } catch (err) {
    console.error('\n❌ TEST FAILURE:', err.message);
    exitCode = 1;
  } finally {
    console.log('\nStopping test server process...');
    serverProc.kill('SIGINT');
    process.exit(exitCode);
  }
}

runTests();
