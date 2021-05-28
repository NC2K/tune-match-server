export function mungeSearch(arr) {
  return arr.results.map(data => {
    return {
      title: data.trackName,
      artist: data.artistName,
      song: data.previewUrl,
      albumArt: data.artworkUrl60,
      genre: data.primaryGenreName
    };
  });
}