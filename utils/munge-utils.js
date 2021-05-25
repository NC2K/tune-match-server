export function mungeSearch(arr) {
  
  // const newArr = arr.replace(/(\r\n|\n|\r)/gm, '');
  // const key = Object.keys(newArr)[1];
  // console.log('NEW ARRAY:', arr);
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