import categories from '../data/categories';
import { mungeSearch } from '../utils/munge-utils';

describe('API Data Munging', () => {
  const expectedSearch = [{
    title: 'You Get What You Give',
    artist: 'New Radicals',
    song: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview71/v4/ab/0c/d5/ab0cd56a-b042-5132-fd70-0a6b6826f5bf/mzaf_6259006033703974886.plus.aac.p.m4a',
    albumArt: 'https://is5-ssl.mzstatic.com/image/thumb/Music/v4/9f/99/07/9f990707-cf0c-9275-334d-a4d0f5522d2c/source/60x60bb.jpg',
    genre: 'Pop'
  }];

  test('munges data', () => {
    const output = mungeSearch(categories);
    expect(output).toEqual(expectedSearch);
  });
});