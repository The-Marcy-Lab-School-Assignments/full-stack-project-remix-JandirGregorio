const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  // Drop tables in reverse dependency order (anime_entries references users via FK)
  await pool.query('DROP TABLE IF EXISTS anime_entries');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE anime_entries (
      entry_id     SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      status      TEXT DEFAULT 'plan to watch',
      rating      INTEGER CHECK (rating >= 1 AND rating <= 10),
      notes       TEXT
      user_id     INT REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  const [aliceHash, bobHash] = await Promise.all([
    bcrypt.hash('password123', SALT_ROUNDS),
    bcrypt.hash('password123', SALT_ROUNDS),
  ]);

  const { rows: users } = await pool.query(`
    INSERT INTO users (username, password_hash) VALUES
      ('alice', $1),
      ('bob',   $2)
    RETURNING user_id, username
  `, [aliceHash, bobHash]);

  const [alice, bob] = users;

   await pool.query(`
    INSERT INTO anime_entries (title, status, rating, notes, user_id) VALUES
      ('Fullmetal Alchemist: Brotherhood', 'completed',     10, 'An all-time classic.',          $1),
      ('Attack on Titan',                  'completed',      9, 'Incredible story progression.', $1),
      ('Demon Slayer',                     'watching',       8, 'Stunning animation.',           $1),
      ('One Piece',                        'plan to watch', NULL, 'Need to start this one.',     $1),
      ('Steins;Gate',                      'completed',     10, 'Mind-bending time travel.',     $2),
      ('Hunter x Hunter',                  'completed',      9, 'Great power system.',           $2),
      ('Jujutsu Kaisen',                   'watching',       8, 'Loving it so far.',             $2),
      ('Vinland Saga',                     'plan to watch', NULL, 'Heard great things.',         $2)
  `, [alice.user_id, bob.user_id]);

  return users;
};

seed()
  .then((users) => {
    console.log('Database seeded successfully.');
    console.log(`  Users: ${users.map((u) => u.username).join(', ')}`);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
