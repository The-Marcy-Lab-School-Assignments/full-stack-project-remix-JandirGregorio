const pool = require('../db/pool');

// Returns all anime entries for a specific user, ordered by creation time
module.exports.listByUser = async (user_id) => {
  const query = 'SELECT * FROM anime_entries WHERE user_id = $1 ORDER BY entry_id ASC';
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single anime entry row (used for ownership checks before update/delete)
module.exports.find = async (entry_id) => {
  const query = 'SELECT * FROM anime_entries WHERE entry_id = $1';
  const { rows } = await pool.query(query, [entry_id]);
  return rows[0] || null;
};

// Creates a new anime entry. Returns the full anime entry row.
module.exports.create = async (title, status, rating, season, episode, notes, user_id) => {
  const query = `INSERT INTO anime_entries (title, status, rating, season, episode, notes, user_id)
                  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
  const { rows } = await pool.query(query, [title, status, rating, season, episode, notes, user_id]);
  return rows[0];
};

// Updates title, status, rating, and notes for an anime entry. Returns the updated row.
module.exports.update = async (entry_id, { title, status, season, episode, rating, notes }) => {
  const query = `
                UPDATE anime_entries
                SET 
                  title   = COALESCE($1, title),
                  status  = COALESCE($2, status),
                  rating  = COALESCE($3, rating),
                  season  = COALESCE($4, season),
                  episode = COALESCE($5, episode),
                  notes   = COALESCE($6, notes)
                WHERE entry_id = $7
                RETURNING *`;
  const { rows } = await pool.query(query, [title, status, rating, season, episode, notes, entry_id]);
  return rows[0];
};

// Deletes an anime entry by id
module.exports.destroy = async (entry_id) => {
  const query = 'DELETE FROM anime_entries WHERE entry_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [entry_id]);
  return rows[0] || null;
};
