const fs = require('fs');
const path = require('path');
const { query } = require('./connection');

async function seedDatabase() {
  try {
    console.log('[SEED] Checking database state for initial records...');

    // 0. Ensure all tables exist from schema.sql
    try {
      const schemaPath = path.join(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        const statements = schemaSql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--') && !s.toLowerCase().startsWith('create database') && !s.toLowerCase().startsWith('use '));
        for (const statement of statements) {
          try {
            await query(statement);
          } catch (stErr) {
            // Ignore if table exists or minor warning
          }
        }
        console.log('[SCHEMA] Verified database tables are initialized');
      }
    } catch (schemaErr) {
      console.warn('[SCHEMA NOTE]', schemaErr.message);
    }

    // Check users
    const existingUsers = await query('SELECT COUNT(*) as count FROM users');
    if (existingUsers && existingUsers[0] && existingUsers[0].count > 0) {
      // Ensure Rakesh Sharma exists for default login
      const rakeshCheck = await query('SELECT id FROM users WHERE phone = ?', ['9876543210']);
      if (rakeshCheck.length === 0) {
        await query(
          'INSERT INTO users (name, phone, email, role, rating, is_verified, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
          ['Rakesh Sharma', '9876543210', 'rakesh.sharma@example.com', 'customer', 4.8, 1, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80']
        );
        console.log('[SEED] Restored default user Rakesh Sharma (9876543210)');
      }
      console.log('[SEED] Database contains records. Ready.');
      return;
    }

    console.log('[SEED] Seeding initial data for SellBuy platform...');

    // 1. Seed Brands
    const brands = [
      { name: 'Maruti Suzuki', is_popular: 1, logo_icon: '🚗' },
      { name: 'Hyundai', is_popular: 1, logo_icon: '🚙' },
      { name: 'Tata', is_popular: 1, logo_icon: '🏎️' },
      { name: 'Mahindra', is_popular: 1, logo_icon: '🚐' },
      { name: 'Kia', is_popular: 1, logo_icon: '🚘' },
      { name: 'Honda', is_popular: 1, logo_icon: '🚖' },
      { name: 'Toyota', is_popular: 1, logo_icon: '🚙' },
      { name: 'Volkswagen', is_popular: 0, logo_icon: '🚗' }
    ];

    for (const b of brands) {
      await query('INSERT INTO brands (name, is_popular, logo_icon) VALUES (?, ?, ?)', [b.name, b.is_popular, b.logo_icon]);
    }

    // Get brand map
    const brandRows = await query('SELECT id, name FROM brands');
    const brandMap = {};
    brandRows.forEach(r => { brandMap[r.name] = r.id; });

    // 2. Seed Models
    const models = [
      { brand: 'Hyundai', name: 'Creta', body_type: 'SUV' },
      { brand: 'Hyundai', name: 'Venue', body_type: 'SUV' },
      { brand: 'Hyundai', name: 'i20', body_type: 'Hatchback' },
      { brand: 'Hyundai', name: 'Verna', body_type: 'Sedan' },
      { brand: 'Maruti Suzuki', name: 'Swift', body_type: 'Hatchback' },
      { brand: 'Maruti Suzuki', name: 'Brezza', body_type: 'SUV' },
      { brand: 'Maruti Suzuki', name: 'Baleno', body_type: 'Hatchback' },
      { brand: 'Tata', name: 'Nexon', body_type: 'SUV' },
      { brand: 'Tata', name: 'Harrier', body_type: 'SUV' },
      { brand: 'Tata', name: 'Punch', body_type: 'SUV' },
      { brand: 'Mahindra', name: 'Scorpio', body_type: 'SUV' },
      { brand: 'Mahindra', name: 'XUV700', body_type: 'SUV' },
      { brand: 'Mahindra', name: 'Thar', body_type: 'SUV' },
      { brand: 'Kia', name: 'Seltos', body_type: 'SUV' },
      { brand: 'Kia', name: 'Sonet', body_type: 'SUV' },
      { brand: 'Honda', name: 'City', body_type: 'Sedan' },
      { brand: 'Toyota', name: 'Fortuner', body_type: 'SUV' }
    ];

    for (const m of models) {
      if (brandMap[m.brand]) {
        await query('INSERT INTO car_models (brand_id, name, body_type) VALUES (?, ?, ?)', [brandMap[m.brand], m.name, m.body_type]);
      }
    }

    // 3. Seed Cities
    const cities = [
      { name: 'Jaipur', state: 'Rajasthan', is_popular: 1 },
      { name: 'Delhi', state: 'Delhi NCR', is_popular: 1 },
      { name: 'Mumbai', state: 'Maharashtra', is_popular: 1 },
      { name: 'Bangalore', state: 'Karnataka', is_popular: 1 },
      { name: 'Hyderabad', state: 'Telangana', is_popular: 1 },
      { name: 'Chennai', state: 'Tamil Nadu', is_popular: 1 },
      { name: 'Ahmedabad', state: 'Gujarat', is_popular: 1 },
      { name: 'Pune', state: 'Maharashtra', is_popular: 1 },
      { name: 'Kolkata', state: 'West Bengal', is_popular: 1 },
      { name: 'Lucknow', state: 'Uttar Pradesh', is_popular: 0 },
      { name: 'Chandigarh', state: 'Punjab', is_popular: 0 }
    ];

    for (const c of cities) {
      await query('INSERT INTO cities (name, state, is_popular) VALUES (?, ?, ?)', [c.name, c.state, c.is_popular]);
    }

    // 4. Seed Users
    // Rakesh Sharma as portrayed in UI screenshots
    const users = [
      {
        name: 'Rakesh Sharma',
        phone: '9876543210',
        email: 'rakesh.sharma@example.com',
        role: 'customer',
        rating: 4.8,
        is_verified: 1,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Priya Patel',
        phone: '9812345678',
        email: 'priya.patel@example.com',
        role: 'customer',
        rating: 4.9,
        is_verified: 1,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Amit Verma',
        phone: '9988776655',
        email: 'amit.verma@example.com',
        role: 'customer',
        rating: 4.7,
        is_verified: 1,
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Admin Manager',
        phone: '9999999999',
        email: 'admin@sellbuy.in',
        role: 'admin',
        rating: 5.0,
        is_verified: 1,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
      }
    ];

    for (const u of users) {
      await query(
        'INSERT INTO users (name, phone, email, role, rating, is_verified, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [u.name, u.phone, u.email, u.role, u.rating, u.is_verified, u.avatar]
      );
    }

    const userRows = await query('SELECT id, phone, name FROM users');
    const userMap = {};
    userRows.forEach(u => { userMap[u.phone] = u.id; });

    const rakeshId = userMap['9876543210'];
    const priyaId = userMap['9812345678'];
    const amitId = userMap['9988776655'];
    const adminId = userMap['9999999999'];

    // 5. Seed Car Listings
    const listings = [
      {
        user_id: rakeshId,
        brand_id: brandMap['Hyundai'],
        model_name: 'Creta',
        manufacturing_year: 2021,
        reg_year: 2021,
        reg_city: 'Jaipur, Rajasthan',
        price: 1150000,
        km_driven: 30000,
        fuel_type: 'Petrol',
        transmission: 'Manual',
        ownership: '1st Owner',
        title: 'Hyundai Creta 2021 SX Petrol',
        description: 'Well maintained Hyundai Creta 2021 model. Single owner, non-accidental, brand new tires, comprehensive insurance valid till Dec 2026. All service records available from authorized Hyundai service center.',
        status: 'active',
        is_featured: 1,
        is_certified: 1,
        views_count: 842,
        images: ['/assets/cars/creta.jpg', '/assets/cars/interior.jpg']
      },
      {
        user_id: rakeshId,
        brand_id: brandMap['Maruti Suzuki'],
        model_name: 'Swift',
        manufacturing_year: 2019,
        reg_year: 2019,
        reg_city: 'Jaipur, Rajasthan',
        price: 520000,
        km_driven: 45000,
        fuel_type: 'Diesel',
        transmission: 'Manual',
        ownership: '1st Owner',
        title: 'Maruti Swift 2019 VDI Diesel',
        description: 'Very well kept Maruti Swift diesel. High mileage efficiency (24 kmpl), clean interior, chilled AC, new seat covers and alloy wheels.',
        status: 'active',
        is_featured: 1,
        is_certified: 0,
        views_count: 512,
        images: ['/assets/cars/swift.jpg', '/assets/cars/interior.jpg']
      },
      {
        user_id: priyaId,
        brand_id: brandMap['Tata'],
        model_name: 'Nexon',
        manufacturing_year: 2022,
        reg_year: 2022,
        reg_city: 'Jaipur, Rajasthan',
        price: 980000,
        km_driven: 25000,
        fuel_type: 'Petrol',
        transmission: 'Automatic',
        ownership: '1st Owner',
        title: 'Tata Nexon 2022 XZA Plus',
        description: '5-star safety rated Tata Nexon Automatic with sunroof, digital cluster, and touchscreen infotainment. Zero depreciation insurance valid.',
        status: 'active',
        is_featured: 1,
        is_certified: 1,
        views_count: 650,
        images: ['/assets/cars/creta.jpg', '/assets/cars/interior.jpg']
      },
      {
        user_id: amitId,
        brand_id: brandMap['Mahindra'],
        model_name: 'Scorpio',
        manufacturing_year: 2018,
        reg_year: 2018,
        reg_city: 'Jaipur, Rajasthan',
        price: 1275000,
        km_driven: 60000,
        fuel_type: 'Diesel',
        transmission: 'Manual',
        ownership: '2nd Owner',
        title: 'Mahindra Scorpio 2018 S11 4WD',
        description: 'Powerful SUV with 4x4, roof carrier, heavy duty bumper, LED projection lamps, and premium black upholstery. Ready for long tours and highway cruising.',
        status: 'active',
        is_featured: 1,
        is_certified: 0,
        views_count: 1020,
        images: ['/assets/cars/scorpio.jpg', '/assets/cars/interior.jpg']
      },
      {
        user_id: priyaId,
        brand_id: brandMap['Kia'],
        model_name: 'Seltos',
        manufacturing_year: 2020,
        reg_year: 2020,
        reg_city: 'Delhi',
        price: 1350000,
        km_driven: 40000,
        fuel_type: 'Diesel',
        transmission: 'Automatic',
        ownership: '1st Owner',
        title: 'Kia Seltos 2020 GTX Plus Automatic',
        description: 'Top end model with Bose 8 speaker audio system, ventilated seats, 360 degree camera, and panoramic sunroof.',
        status: 'active',
        is_featured: 1,
        is_certified: 1,
        views_count: 730,
        images: ['/assets/cars/creta.jpg', '/assets/cars/interior.jpg']
      },
      {
        user_id: rakeshId,
        brand_id: brandMap['Tata'],
        model_name: 'Harrier',
        manufacturing_year: 2023,
        reg_year: 2023,
        reg_city: 'Mumbai',
        price: 1950000,
        km_driven: 14000,
        fuel_type: 'Diesel',
        transmission: 'Automatic',
        ownership: '1st Owner',
        title: 'Tata Harrier 2023 Dark Edition XZA+',
        description: 'Stunning Dark Edition Harrier, barely driven, under manufacturer warranty. ADAS safety features, 360 camera, ambient lighting.',
        status: 'pending',
        is_featured: 0,
        is_certified: 1,
        views_count: 120,
        images: ['/assets/cars/scorpio.jpg']
      },
      {
        user_id: amitId,
        brand_id: brandMap['Honda'],
        model_name: 'City',
        manufacturing_year: 2017,
        reg_year: 2017,
        reg_city: 'Bangalore',
        price: 680000,
        km_driven: 55000,
        fuel_type: 'Petrol',
        transmission: 'Manual',
        ownership: '1st Owner',
        title: 'Honda City 2017 VX i-VTEC',
        description: 'Smooth i-VTEC engine, pristine condition, full company service record, ivory leather interior.',
        status: 'sold',
        is_featured: 0,
        is_certified: 0,
        views_count: 890,
        images: ['/assets/cars/swift.jpg']
      }
    ];

    for (const car of listings) {
      const res = await query(
        `INSERT INTO car_listings 
        (user_id, brand_id, model_name, manufacturing_year, reg_year, reg_city, price, km_driven, fuel_type, transmission, ownership, title, description, status, is_featured, is_certified, views_count) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          car.user_id, car.brand_id, car.model_name, car.manufacturing_year, car.reg_year, car.reg_city,
          car.price, car.km_driven, car.fuel_type, car.transmission, car.ownership, car.title, car.description,
          car.status, car.is_featured, car.is_certified, car.views_count
        ]
      );
      const listingId = res.insertId;

      for (let i = 0; i < car.images.length; i++) {
        await query(
          'INSERT INTO car_images (listing_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, ?)',
          [listingId, car.images[i], i === 0 ? 1 : 0, i]
        );
      }
    }

    // 6. Seed Chats & Messages
    const cretaListing = (await query('SELECT id FROM car_listings WHERE model_name = "Creta" LIMIT 1'))[0];
    if (cretaListing) {
      const chatRes = await query(
        `INSERT INTO chats (listing_id, buyer_id, seller_id, last_message, last_message_time) 
         VALUES (?, ?, ?, ?, NOW())`,
        [cretaListing.id, priyaId, rakeshId, 'Sure, here are more photos.']
      );
      const chatId = chatRes.insertId;

      await query(
        'INSERT INTO chat_messages (chat_id, sender_id, message_text, created_at) VALUES (?, ?, ?, DATE_SUB(NOW(), INTERVAL 15 MINUTE))',
        [chatId, priyaId, 'Hi, is this car available?']
      );
      await query(
        'INSERT INTO chat_messages (chat_id, sender_id, message_text, created_at) VALUES (?, ?, ?, DATE_SUB(NOW(), INTERVAL 12 MINUTE))',
        [chatId, rakeshId, 'Yes, it is available. Clean single-hand driven.']
      );
      await query(
        'INSERT INTO chat_messages (chat_id, sender_id, message_text, created_at) VALUES (?, ?, ?, DATE_SUB(NOW(), INTERVAL 8 MINUTE))',
        [chatId, priyaId, 'Can I see more photos of interior and engine?']
      );
      await query(
        'INSERT INTO chat_messages (chat_id, sender_id, message_text, attachment_url, created_at) VALUES (?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 4 MINUTE))',
        [chatId, rakeshId, 'Sure, here are more photos of the interior cockpit.', '/assets/cars/interior.jpg']
      );
    }

    // 7. Seed Notifications
    const notifications = [
      { user_id: priyaId, title: 'New message from Rakesh', message: 'Sure, here are more photos.', type: 'messages' },
      { user_id: rakeshId, title: 'Listing Approved', message: 'Your Hyundai Creta 2021 listing is now live!', type: 'listings' },
      { user_id: rakeshId, title: 'New buyer interest', message: '3 new buyers checked your contact details today.', type: 'listings' },
      { user_id: priyaId, title: 'Price alert: Hyundai Creta', message: 'Price dropped by ₹25,000 in Jaipur!', type: 'price_alert' },
      { user_id: priyaId, title: 'New feature available', message: 'Try our 1-click Free RC and Challan inspection report.', type: 'system' }
    ];

    for (const n of notifications) {
      await query(
        'INSERT INTO notifications (user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?)',
        [n.user_id, n.title, n.message, n.type, 0]
      );
    }

    // 8. Seed Audit Logs
    const initialLogs = [
      { user_id: adminId, user_name: 'Admin Manager', action: 'DATABASE_INITIALIZATION', module: 'SYSTEM', details: 'Database schema created and seeded successfully', level: 'INFO' },
      { user_id: rakeshId, user_name: 'Rakesh Sharma', action: 'USER_LOGIN_OTP', module: 'AUTH', details: 'Login successful via mobile 9876543210 with verified OTP', level: 'AUTH' },
      { user_id: rakeshId, user_name: 'Rakesh Sharma', action: 'CAR_LISTING_POSTED', module: 'MARKETPLACE', details: 'Created car listing: Hyundai Creta 2021', level: 'CAR' },
      { user_id: adminId, user_name: 'Admin Manager', action: 'LISTING_APPROVED', module: 'ADMIN', details: 'Approved listing #1 (Hyundai Creta 2021)', level: 'ADMIN' },
      { user_id: priyaId, user_name: 'Priya Patel', action: 'CHAT_INITIATED', module: 'CHAT', details: 'Started buyer inquiry with seller Rakesh Sharma', level: 'INFO' }
    ];

    for (const l of initialLogs) {
      await query(
        'INSERT INTO audit_logs (user_id, user_name, action, module, details, level) VALUES (?, ?, ?, ?, ?, ?)',
        [l.user_id, l.user_name, l.action, l.module, l.details, l.level]
      );
    }

    console.log('[SEED] Successfully seeded brands, models, cities, users, listings, chats, notifications, and logs!');
  } catch (err) {
    console.error('[SEED ERROR] Error seeding database:', err.message);
  }
}

module.exports = { seedDatabase };

if (require.main === module) {
  //seedDatabase().then(() => process.exit(0));
}
