const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Fetch failed. ${response.status} ${response.statusText}`);
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchAllAnime = async () => {
  return handleFetch('/api/anime');
};

export const createAnime = async (title, status, rating, season, episode, notes) => {
  return handleFetch('/api/anime', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, status, rating, season, episode, notes }),
  });
};

export const updateAnime = async (entry_id, updates) => {
  return handleFetch(`/api/anime/${entry_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
};

export const deleteAnime = async (entry_id) => {
  return handleFetch(`/api/anime/${entry_id}`, { method: 'DELETE' });
};
