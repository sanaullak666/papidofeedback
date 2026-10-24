import bcrypt from 'bcryptjs';
import { query } from './connection.js';
import { runMigrations } from './migrate.js';
import { config } from '../config/index.js';

export async function runSeeds() {
  console.log('[Seed] Checking database seeding...');
  await runMigrations();

  // 1. Seed Default Settings
  const settings = [
    {
      key: 'new_booking_website_url',
      value: config.newBookingWebsiteUrl,
      description: 'Public link to the new Papido booking website preview',
    },
    {
      key: 'survey_active',
      value: 'true',
      description: 'Master switch to accept public survey submissions',
    },
    {
      key: 'organization_name',
      value: 'Papido Technologies',
      description: 'Organization name displayed across system',
    },
  ];

  for (const s of settings) {
    await query(
      `INSERT INTO app_settings (setting_key, setting_value, description)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE description = VALUES(description);`,
      [s.key, s.value, s.description]
    );
  }
  console.log('[Seed] Settings verified/seeded.');

  // 2. Seed Default Admin User if none exists
  const existingAdmins = await query('SELECT id FROM admin_users LIMIT 1;');
  if (existingAdmins.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(config.adminDefault.password, salt);

    await query(
      `INSERT INTO admin_users (username, email, password_hash, name, role)
       VALUES (?, ?, ?, ?, 'admin');`,
      [
        'admin',
        config.adminDefault.email,
        passwordHash,
        config.adminDefault.name,
      ]
    );
    console.log(`[Seed] Created initial admin: ${config.adminDefault.email}`);
  } else {
    console.log('[Seed] Admin user already exists. Skipping admin creation.');
  }

  // 3. Optional: Seed realistic demo survey responses if database is completely empty
  const existingResponses = await query('SELECT id FROM survey_responses LIMIT 1;');
  if (existingResponses.length === 0) {
    console.log('[Seed] Populating initial demo feedback responses for rich analytics demo...');
    await seedDemoResponses();
  }

  console.log('[Seed] Database seeding completed successfully.');
}

async function seedDemoResponses() {
  const demoData = [
    {
      feedback_ref: 'PAP-FB-824109',
      current_booking_method: 'WhatsApp',
      whatsapp_satisfaction: 4,
      whatsapp_likes: ['Familiar', 'Quick communication', 'Convenient'],
      whatsapp_likes_other: '',
      whatsapp_difficulties: ['Waiting for confirmation', 'Difficult during busy periods'],
      whatsapp_difficulties_other: '',
      explored_website: 1,
      website_opinion: 'Very Good',
      website_ease_of_use: 'Very Easy',
      website_likes: ['Simple booking process', 'Website design', 'Speed'],
      website_likes_other: '',
      website_improvements: 'Add live driver tracking if possible',
      preferred_booking_method: 'Both',
      website_adoption_intent: 'Definitely Yes',
      continue_whatsapp: 'Yes, but mainly for support',
      both_convenience: 'Definitely Yes',
      requested_features: ['Booking confirmation', 'Ride status', 'Online payment'],
      requested_features_other: '',
      most_important_improvement: 'Instant confirmation without having to wait for manual reply',
      launch_recommendation: 'Launch alongside WhatsApp',
      additional_feedback: 'Excited for the new website! Having both makes Papido flexible.',
      willing_to_contact: 1,
      contact_name: 'Rahul Sharma',
      contact_mobile: '9876543210',
      contact_email: 'rahul.pu@gmail.com',
      status: 'Reviewed',
      admin_notes: 'Great feedback, prefers hybrid rollout',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 19).replace('T', ' '),
    },
    {
      feedback_ref: 'PAP-FB-519382',
      current_booking_method: 'WhatsApp',
      whatsapp_satisfaction: 5,
      whatsapp_likes: ['Easy to use', 'Can directly contact Papido', 'Easy to send booking details'],
      whatsapp_likes_other: '',
      whatsapp_difficulties: ['No major problems'],
      whatsapp_difficulties_other: '',
      explored_website: 1,
      website_opinion: 'Good',
      website_ease_of_use: 'Easy',
      website_likes: ['Website design', 'Booking information'],
      website_likes_other: '',
      website_improvements: 'Keep font sizes readable on small phones',
      preferred_booking_method: 'WhatsApp',
      website_adoption_intent: 'Probably Yes',
      continue_whatsapp: 'Yes',
      both_convenience: 'Probably Yes',
      requested_features: ['Advance booking', 'Notifications'],
      requested_features_other: '',
      most_important_improvement: 'Please do not stop WhatsApp, many students find it easy',
      launch_recommendation: 'Launch alongside WhatsApp',
      additional_feedback: 'WhatsApp is very fast when drivers know our locations.',
      willing_to_contact: 0,
      contact_name: null,
      contact_mobile: null,
      contact_email: null,
      status: 'New',
      admin_notes: null,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 19).replace('T', ' '),
    },
    {
      feedback_ref: 'PAP-FB-193847',
      current_booking_method: 'WhatsApp',
      whatsapp_satisfaction: 2,
      whatsapp_likes: ['Familiar'],
      whatsapp_likes_other: '',
      whatsapp_difficulties: ['Messages can get missed', 'Difficult to know booking status', 'No proper booking history'],
      whatsapp_difficulties_other: '',
      explored_website: 1,
      website_opinion: 'Excellent',
      website_ease_of_use: 'Very Easy',
      website_likes: ['Simple booking process', 'Easy navigation', 'Speed', 'Booking information'],
      website_likes_other: '',
      website_improvements: 'Looks ready for prime time',
      preferred_booking_method: 'Papido Website',
      website_adoption_intent: 'Definitely Yes',
      continue_whatsapp: 'Yes, but mainly for support',
      both_convenience: 'Definitely Yes',
      requested_features: ['Booking history', 'Ride status', 'Online payment', 'Cancellation option'],
      requested_features_other: '',
      most_important_improvement: 'Structured booking history and live status',
      launch_recommendation: 'Move primarily to website',
      additional_feedback: 'Website looks 10x more professional than texting back and forth.',
      willing_to_contact: 1,
      contact_name: 'Ananya Nair',
      contact_mobile: '9447123456',
      contact_email: 'ananya.nair@example.com',
      status: 'Important',
      admin_notes: 'Willing to test beta release',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString().slice(0, 19).replace('T', ' '),
    },
    {
      feedback_ref: 'PAP-FB-638291',
      current_booking_method: 'WhatsApp',
      whatsapp_satisfaction: 3,
      whatsapp_likes: ['Quick communication'],
      whatsapp_likes_other: '',
      whatsapp_difficulties: ['Waiting for confirmation', 'Difficult during busy periods'],
      whatsapp_difficulties_other: '',
      explored_website: 1,
      website_opinion: 'Average',
      website_ease_of_use: 'Neutral',
      website_likes: ['Website design'],
      website_likes_other: '',
      website_improvements: 'Make sure it loads fast on 3G/poor network in campus hostels',
      preferred_booking_method: 'Both',
      website_adoption_intent: 'Maybe',
      continue_whatsapp: 'Yes',
      both_convenience: 'Definitely Yes',
      requested_features: ['Notifications', 'Advance booking'],
      requested_features_other: '',
      most_important_improvement: 'Network resilience & quick booking confirmation',
      launch_recommendation: 'Launch the website after making improvements',
      additional_feedback: 'Test thoroughly in low connectivity spots on campus.',
      willing_to_contact: 0,
      contact_name: null,
      contact_mobile: null,
      contact_email: null,
      status: 'New',
      admin_notes: null,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    },
    {
      feedback_ref: 'PAP-FB-772910',
      current_booking_method: 'WhatsApp',
      whatsapp_satisfaction: 4,
      whatsapp_likes: ['Easy to use', 'Convenient'],
      whatsapp_likes_other: '',
      whatsapp_difficulties: ['Have to manually send booking details'],
      whatsapp_difficulties_other: '',
      explored_website: 1,
      website_opinion: 'Very Good',
      website_ease_of_use: 'Easy',
      website_likes: ['Simple booking process', 'Convenience'],
      website_likes_other: '',
      website_improvements: 'Add WhatsApp notification when website booking is confirmed',
      preferred_booking_method: 'Papido Website',
      website_adoption_intent: 'Probably Yes',
      continue_whatsapp: 'Yes, but mainly for support',
      both_convenience: 'Definitely Yes',
      requested_features: ['Booking confirmation', 'Notifications', 'Easier passenger details'],
      requested_features_other: '',
      most_important_improvement: 'Clear pickup point indicators on campus',
      launch_recommendation: 'Launch alongside WhatsApp',
      additional_feedback: 'Great initiative by Papido team!',
      willing_to_contact: 1,
      contact_name: 'Mohammed Faizal',
      contact_mobile: '9840112233',
      contact_email: 'faizal.m@pu.ac.in',
      status: 'Reviewed',
      admin_notes: 'Requested WhatsApp confirmation integration',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }
  ];

  for (const item of demoData) {
    await query(
      `INSERT INTO survey_responses (
        feedback_ref, current_booking_method, whatsapp_satisfaction,
        whatsapp_likes, whatsapp_likes_other, whatsapp_difficulties, whatsapp_difficulties_other,
        explored_website, website_opinion, website_ease_of_use,
        website_likes, website_likes_other, website_improvements,
        preferred_booking_method, website_adoption_intent, continue_whatsapp, both_convenience,
        requested_features, requested_features_other, most_important_improvement, launch_recommendation,
        additional_feedback, willing_to_contact, contact_name, contact_mobile, contact_email,
        status, admin_notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        item.feedback_ref,
        item.current_booking_method,
        item.whatsapp_satisfaction,
        JSON.stringify(item.whatsapp_likes),
        item.whatsapp_likes_other,
        JSON.stringify(item.whatsapp_difficulties),
        item.whatsapp_difficulties_other,
        item.explored_website,
        item.website_opinion,
        item.website_ease_of_use,
        JSON.stringify(item.website_likes),
        item.website_likes_other,
        item.website_improvements,
        item.preferred_booking_method,
        item.website_adoption_intent,
        item.continue_whatsapp,
        item.both_convenience,
        JSON.stringify(item.requested_features),
        item.requested_features_other,
        item.most_important_improvement,
        item.launch_recommendation,
        item.additional_feedback,
        item.willing_to_contact,
        item.contact_name,
        item.contact_mobile,
        item.contact_email,
        item.status,
        item.admin_notes,
        item.created_at,
      ]
    );
  }
  console.log(`[Seed] Seeded ${demoData.length} initial responses.`);
}

if (process.argv[1]?.endsWith('seed.js')) {
  runSeeds()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed] Failed:', err);
      process.exit(1);
    });
}
