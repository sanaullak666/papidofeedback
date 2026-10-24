import { query } from '../db/connection.js';
import { generateUniqueFeedbackRef } from '../utils/referenceGenerator.js';

export async function submitSurvey(req, res) {
  try {
    const {
      // Step 1
      whatsapp_satisfaction,
      whatsapp_likes = [],
      whatsapp_likes_other = '',
      whatsapp_difficulties = [],
      whatsapp_difficulties_other = '',

      // Step 2 & 3
      explored_website = false,
      website_opinion,
      website_ease_of_use,
      website_likes = [],
      website_likes_other = '',
      website_improvements = '',

      // Step 4
      preferred_booking_method,
      website_adoption_intent,
      continue_whatsapp,
      both_convenience,

      // Step 5
      requested_features = [],
      requested_features_other = '',
      most_important_improvement = '',
      launch_recommendation,

      // Final Feedback & Contact
      additional_feedback = '',
      willing_to_contact = false,
      contact_name = '',
      contact_mobile = '',
      contact_email = '',
    } = req.body;

    // --- Validation ---
    const errors = [];

    // WhatsApp satisfaction: 1 to 5
    const satNum = parseInt(whatsapp_satisfaction, 10);
    if (isNaN(satNum) || satNum < 1 || satNum > 5) {
      errors.push('WhatsApp satisfaction must be a rating between 1 and 5.');
    }

    // Website opinion
    const validOpinions = ['Excellent', 'Very Good', 'Good', 'Average', 'Needs Improvement'];
    if (!website_opinion || !validOpinions.includes(website_opinion)) {
      errors.push('Please select a valid overall website opinion.');
    }

    // Website ease of use
    const validEase = ['Very Easy', 'Easy', 'Neutral', 'Difficult', 'Very Difficult'];
    if (!website_ease_of_use || !validEase.includes(website_ease_of_use)) {
      errors.push('Please select a valid website ease-of-use rating.');
    }

    // Preferred booking method
    const validMethods = ['WhatsApp', 'Papido Website', 'Both', 'No preference'];
    if (!preferred_booking_method || !validMethods.includes(preferred_booking_method)) {
      errors.push('Please select your preferred booking method.');
    }

    // Website adoption intent
    const validAdoption = ['Definitely Yes', 'Probably Yes', 'Maybe', 'Probably Not', 'Definitely Not'];
    if (!website_adoption_intent || !validAdoption.includes(website_adoption_intent)) {
      errors.push('Please specify if you would use the new website.');
    }

    // Continue WhatsApp
    const validContinuation = ['Yes', 'No', 'Yes, but mainly for support', 'Not sure'];
    if (!continue_whatsapp || !validContinuation.includes(continue_whatsapp)) {
      errors.push('Please select an option for continuing WhatsApp booking.');
    }

    // Both convenience
    const validBoth = ['Definitely Yes', 'Probably Yes', 'Neutral', 'Probably No', 'Definitely No'];
    if (!both_convenience || !validBoth.includes(both_convenience)) {
      errors.push('Please indicate if having both options adds convenience.');
    }

    // Launch recommendation
    const validRecommendations = [
      'Launch alongside WhatsApp',
      'Move primarily to website',
      'Launch after improvements',
      'Continue with WhatsApp',
      'Not sure',
    ];
    // Map user labels safely if client sends standard text
    let normalizedLaunchRec = launch_recommendation;
    if (normalizedLaunchRec === 'Launch the new website alongside WhatsApp') {
      normalizedLaunchRec = 'Launch alongside WhatsApp';
    } else if (normalizedLaunchRec === 'Move primarily to website booking') {
      normalizedLaunchRec = 'Move primarily to website';
    } else if (normalizedLaunchRec === 'Launch the website after making improvements') {
      normalizedLaunchRec = 'Launch after improvements';
    } else if (normalizedLaunchRec === 'Continue with WhatsApp booking') {
      normalizedLaunchRec = 'Continue with WhatsApp';
    } else if (normalizedLaunchRec === "I'm not sure") {
      normalizedLaunchRec = 'Not sure';
    }

    if (!normalizedLaunchRec || !validRecommendations.includes(normalizedLaunchRec)) {
      errors.push('Please select a valid launch recommendation.');
    }

    // Optional contact validation
    if (willing_to_contact) {
      if (contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email)) {
        errors.push('Please enter a valid email address.');
      }
      if (contact_mobile && !/^[0-9+ -]{7,15}$/.test(contact_mobile)) {
        errors.push('Please enter a valid contact phone number.');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Survey validation failed.',
        errors,
      });
    }

    // --- Prevent rapid accidental duplicates ---
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    const clientIp = typeof ip === 'string' ? ip.split(',')[0].trim() : null;
    const userAgent = (req.headers['user-agent'] || '').slice(0, 500);

    const duplicateCheck = await query(
      `SELECT feedback_ref FROM survey_responses 
       WHERE ip_address = ? 
       AND whatsapp_satisfaction = ? 
       AND website_opinion = ?
       AND preferred_booking_method = ?
       AND created_at >= NOW() - INTERVAL 1 MINUTE
       ORDER BY id DESC LIMIT 1;`,
      [clientIp, satNum, website_opinion, preferred_booking_method]
    );

    if (duplicateCheck.length > 0) {
      // Rapid identical submission detected; return the previously generated reference gracefully
      return res.status(200).json({
        success: true,
        message: 'Your response was already received. Thank you!',
        feedbackRef: duplicateCheck[0].feedback_ref,
        isDuplicateSuppressed: true,
      });
    }

    // --- Generate Unique Reference ---
    const feedbackRef = await generateUniqueFeedbackRef();

    // --- Insert Survey Response ---
    await query(
      `INSERT INTO survey_responses (
        feedback_ref, current_booking_method, whatsapp_satisfaction,
        whatsapp_likes, whatsapp_likes_other, whatsapp_difficulties, whatsapp_difficulties_other,
        explored_website, website_opinion, website_ease_of_use,
        website_likes, website_likes_other, website_improvements,
        preferred_booking_method, website_adoption_intent, continue_whatsapp, both_convenience,
        requested_features, requested_features_other, most_important_improvement, launch_recommendation,
        additional_feedback, willing_to_contact, contact_name, contact_mobile, contact_email,
        status, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', ?, ?);`,
      [
        feedbackRef,
        'WhatsApp',
        satNum,
        JSON.stringify(whatsapp_likes || []),
        whatsapp_likes_other ? String(whatsapp_likes_other).trim() : null,
        JSON.stringify(whatsapp_difficulties || []),
        whatsapp_difficulties_other ? String(whatsapp_difficulties_other).trim() : null,
        explored_website ? 1 : 0,
        website_opinion,
        website_ease_of_use,
        JSON.stringify(website_likes || []),
        website_likes_other ? String(website_likes_other).trim() : null,
        website_improvements ? String(website_improvements).trim() : null,
        preferred_booking_method,
        website_adoption_intent,
        continue_whatsapp,
        both_convenience,
        JSON.stringify(requested_features || []),
        requested_features_other ? String(requested_features_other).trim() : null,
        most_important_improvement ? String(most_important_improvement).trim() : null,
        normalizedLaunchRec,
        additional_feedback ? String(additional_feedback).trim() : null,
        willing_to_contact ? 1 : 0,
        willing_to_contact && contact_name ? String(contact_name).trim() : null,
        willing_to_contact && contact_mobile ? String(contact_mobile).trim() : null,
        willing_to_contact && contact_email ? String(contact_email).trim() : null,
        clientIp,
        userAgent,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Survey submitted successfully!',
      feedbackRef,
    });
  } catch (err) {
    console.error('[SurveyController] submitSurvey error:', err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your opinion. Please try again.',
    });
  }
}

export async function getPublicSettings(req, res) {
  try {
    const settingsRows = await query('SELECT setting_key, setting_value FROM app_settings;');
    const settingsMap = {};
    settingsRows.forEach((row) => {
      settingsMap[row.setting_key] = row.setting_value;
    });

    return res.json({
      success: true,
      settings: {
        newBookingWebsiteUrl: settingsMap.new_booking_website_url || 'https://www.papido.online',
        surveyActive: settingsMap.survey_active !== 'false',
        organizationName: settingsMap.organization_name || 'Papido',
      },
    });
  } catch (err) {
    console.error('[SurveyController] getPublicSettings error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve configuration.',
    });
  }
}
