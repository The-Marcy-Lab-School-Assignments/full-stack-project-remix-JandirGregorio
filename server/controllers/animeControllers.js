const animeModel = require('../models/animeModel');

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
    const { title, status, rating, notes } = req.body;
    if (!title || !status) {
      return res.status(400).send({ error: 'Title and status are required.' });
    }
    if (rating !== undefined && Number.isInteger(Number(rating))) {
      return res.status(400).send({ error: 'Rating must be an integer between 1 and 10.' });
    }

    const parsedRating = rating ? parseInt(rating) : null;
    const anime = await animeModel.create(title, status, parsedRating, notes, req.session.user_id);
    res.status(201).send(anime);
  } catch (err) {
    next(err);
  }
};

module.exports.updateAnimeEntry = async (req, res, next) => {
  try {
    const { entry_id } = req.params;
    const { rating } = req.body;
    if (rating !== undefined && !isValidRating(rating)) {
      return res.status(400).send({ error: 'Rating must be an integer between 1 and 10.' });
    }
    const anime = await animeModel.find(entry_id);
    if (!anime) return res.status(404).send({ error: 'Anime entry not found.' });
    if (anime.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const updatedAnimeEntry = await animeModel.update(entry_id, req.body);
    res.send(updatedAnimeEntry);
  } catch (err) {
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
