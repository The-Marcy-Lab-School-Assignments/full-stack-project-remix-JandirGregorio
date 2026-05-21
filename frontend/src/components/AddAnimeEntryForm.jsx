import { createAnime } from '../adapters/anime-adapters';

const STATUS = ['Plan To Watch', 'Watching', 'Completed', 'Dropped'];

function AddAnimeEntryForm({ loadEntries }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.elements.title.value;
    const status = form.elements.status.value;
    const rating = form.elements.rating.value;
    const season = form.elements.season.value;
    const episode = form.elements.episode.value;
    const notes = form.elements.notes.value;
    
    if (!title || !status) return;

    const { error } = await createAnime(title, status, rating, season, episode, notes);
    if (error) return console.error(error);

    await loadEntries();
    form.reset();
  };

  return (
    <form id="add-entry-form" onSubmit={handleSubmit}>
      <h2>New Anime Entry:</h2>

      <label htmlFor="title-input">Title</label>
      <input type="text" name="title" id="title-input" placeholder="e.g. One Piece" required />

      <label htmlFor="status-dropdown">Status</label>
      <select name="status" id="status-dropdown" required >
        <option value="">-- select --</option>
        {STATUS.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>

      <label htmlFor="rating-input">Rating</label>
      <input type="number" name="rating" min="1" max="10" id="rating-input" placeholder='1 - 10' />

      <label htmlFor="season-input">Season</label>
      <input type="number" name="season" min="1" max="50" id="season-input" placeholder="1 - 50"/>

      <label htmlFor="episode-input">Episode</label>
      <input type="number" name="episode" min="1" max="2000" id="episode-input" placeholder="1 - 2000"/>

      <label htmlFor="notes-input">Notes</label>
      <textarea name="notes" id="notes-input" placeholder="What are your thoughts?"></textarea>
      
      <button type="submit">+Add Entry</button>
    </form>
  );
}

export default AddAnimeEntryForm;
