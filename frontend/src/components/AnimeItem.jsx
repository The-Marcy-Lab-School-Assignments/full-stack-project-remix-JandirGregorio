import {useState} from 'react';
import { deleteAnime, updateAnime } from '../adapters/anime-adapters';
import EditEntryForm from './EditEntryForm';

const STATUS = ['plan to watch', 'watching', 'completed', 'dropped'];

function AnimeItem({ entry, loadEntries }) {
  const handleStatusChange = async (e) => {
    const { error } = await updateAnime(entry.entry_id, { status: e.target.value });
    if (error) return console.error(error);
    loadEntries();
  };

  const statusClass = {
    'watching': 'status-watching',
    'completed': 'status-completed',
    'plan to watch': 'status-plan-to-watch',
    'dropped': 'status-dropped',
  };

  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async () => {
    const { error } = await deleteAnime(entry.entry_id);
    if (error) return console.error(error);
    loadEntries();
  };

  return (
    <>
    <li className={`anime-item ${statusClass[entry.status.toLowerCase()] || ''}`}>
      <div className="anime-item-header">
        <span className="title">{entry.title}</span>
        {entry.rating && <span className="rating">{entry.rating}/10</span> || <span className="rating">N\A</span>}
        <select
          className="status-select"
          value={entry.status}
          onChange={handleStatusChange}
        >
          {STATUS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className="anime-item-actions">
          <button className="edit-btn" onClick={() => setShowEdit(true)}>Edit</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      </div>
      {entry.notes && (
        <div className="anime-item-notes">
          <p>{entry.notes}</p>
        </div>
      )}
    </li>

    {showEdit && (
      <EditEntryForm
        entry={entry}
        onClose={() => setShowEdit(false)}
        loadEntries={loadEntries}
      />
    )}
  </>
  );
}

export default AnimeItem;
