import { useState, useEffect } from 'react';
import { fetchAllAnime } from '../adapters/anime-adapters';
import AddAnimeEntryForm from './AddAnimeEntryForm';
import AnimeList from './AnimeList';

function AnimePage({ currentUser, handleLogout }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEntries = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchAllAnime();
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setEntries(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  return (
    <section>
      <div id="user-controls">
        <span>Welcome, <strong>{currentUser.username}</strong>!</span>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <div id="anime-page-layout">
        <AddAnimeEntryForm loadEntries={loadEntries} />
        <div id="anime-list-section">
          {isLoading && <p>Loading...</p>}
          {error && <p className="error">Something went wrong: {error}</p>}
          <AnimeList entries={entries} loadEntries={loadEntries} />
        </div>
      </div>
    </section>
  );
}

export default AnimePage;
