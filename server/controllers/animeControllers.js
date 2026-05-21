const animeModel = require('../models/animeModel');

const VALID_STATUSES = ['plan to watch', 'watching', 'completed', 'dropped'];

// Fetches a list of anime
module.exports.listAnime = async (req, res, next) => {
  try {
    const anime = await animeModel.listByUser(req.session.user_id);
    res.send(anime);
  } catch (err) {
    next(err);
  }
};

module.exports.createAnimeEntry = async (req, res, next) => {
  try {
    const { title, status, rating, season, episode, notes } = req.body;
    if (!title || !status) {
      return res.status(400).send({ error: 'Title and status are required.' });
    }

    if (status && !VALID_STATUSES.includes(status.toLowerCase())) {
      return res.status(400).send({ error: 'Invalid status value.' });
    }

    const normalizedStatus = status ? status.toLowerCase() : undefined;
    const parsedRating = rating ? parseInt(rating) : null;
    const parsedSeason = season ? parseInt(season) : null;
    const parsedEpisode = episode ? parseInt(episode) : null;
    const anime = await animeModel.create(title, normalizedStatus, parsedRating, parsedSeason, parsedEpisode, notes, req.session.user_id);
    res.status(201).send(anime);
  } catch (err) {
    if (err.code === '23514') {
      return res.status(400).send( { error: 'Rating must be between an integer between 1 and 10.' });
    }
    next(err);
  }
};

module.exports.updateAnimeEntry = async (req, res, next) => {
  try {
    const { entry_id } = req.params;
    const { title, status, rating, season, episode, notes } = req.body;

    if (status && !VALID_STATUSES.includes(status.toLowerCase())) {
      return res.status(400).send({ error: 'Invalid status value.' });
    }

    const anime = await animeModel.find(entry_id);
    if (!anime) return res.status(404).send({ error: 'Anime entry not found.' });
    if (anime.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    const normalizedStatus = status ? status.toLowerCase() : undefined;
    const parsedRating = rating ? parseInt(rating) : null;
    const parsedSeason = season ? parseInt(season) : null;
    const parsedEpisode = episode ? parseInt(episode) : null;

    const updatedAnimeEntry = await animeModel.update(entry_id, {
      title, status: normalizedStatus, rating: parsedRating, season: parsedSeason, episode: parsedEpisode, notes
    });
    res.send(updatedAnimeEntry);
  } catch (err) {
    if (err.code === '23514') {
      return res.status(400).send( { error: 'Rating must an integer between 1 and 10.' });
    }
    next(err);
  }
};

module.exports.deleteAnimeEntry = async (req, res, next) => {
  try {
    const { entry_id } = req.params;

    const anime = await animeModel.find(entry_id);
    if (!anime) return res.status(404).send({ error: 'Anime entry not found.' });
    if (anime.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    const destroyedAnimeEntry = await animeModel.destroy(entry_id);
    res.send(destroyedAnimeEntry);
  } catch (err) {
    next(err);
  }
};
