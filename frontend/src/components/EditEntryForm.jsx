import { useState, useRef, useEffect } from 'react';
import { updateAnime } from '../adapters/anime-adapters';

const STATUS = ['Plan To Watch', 'Watching', 'Completed', 'Dropped'];

function EditEntryForm({ entry, onClose, loadEntries }) {
  const [form, setForm] = useState({
    title: entry.title || '',
    status: entry.status || '',
    rating: entry.rating || '',
    season: entry.season || '',
    episode: entry.episode || '',
    notes: entry.notes || '',
  });
  const dialogRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await updateAnime(entry.entry_id, form);
    if (error) return console.error(error);
    await loadEntries();
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) onClose();
  };

  useEffect(() => {
    dialogRef.current.showModal();
  }, []);

  return (
    <dialog ref={dialogRef} onClose={onClose} onClick={handleBackdropClick} >
      <form onSubmit={handleSubmit} id="edit-entry-form">
        <h2>Edit Entry</h2>
        <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} />

        <label htmlFor="edit-rating">Rating</label>
          <input id="edit-status" name="rating" type="number" min="1" max="10" value={form.rating} onChange={handleChange} />

        <label htmlFor="edit-season">Season</label>
        <input id="edit-season" name="season" type="number" min="1" value={form.season} onChange={handleChange} />

        <label htmlFor="edit-episode">Episode</label>
        <input id="edit-episode" name="episode" type="number" min="1" value={form.episode} onChange={handleChange} />

        <label htmlFor="edit-notes">Notes</label>
          <textarea id="edit-notes" name="notes" value={form.notes} onChange={handleChange} />

        <div className="modal-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </dialog>
  );
}

export default EditEntryForm;