import AnimeItem from './AnimeItem';

function AnimeList({ entries, loadEntries }) {
  return (
    <ul id="anime-list">
      {entries.map((entry) => (
        <AnimeItem
          key={entry.entry_id}
          entry={entry}
          loadEntries={loadEntries}
        />
      ))}
    </ul>
  );
}

export default AnimeList;
