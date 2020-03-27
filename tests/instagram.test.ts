import instagram from '../src/services/instagram';

// Instagram testing urls
const igProfile: string = 'https://www.instagram.com/salamkatanani/';
const igImage: string = 'https://www.instagram.com/p/B9WbI9Ypf1f/';
const igVideo: string = 'https://www.instagram.com/p/B8OSV35hDKS/';
const igTV: string = 'https://www.instagram.com/p/B97TREWJJFz/';
const igSideCar: string = 'https://www.instagram.com/p/B76oL__hBf4/';
const igStory: string = 'https://www.instagram.com/stories/salamkatanani';

// Instagram Profile
test('Instagram Profile', async () => {
  const profile = await instagram(igProfile);
});

// Instagram Image
test('Instagram Image', async () => {
  const image = await instagram(igImage);
});

// Instagram Video
test('Instagram Video', async () => {
  const video = await instagram(igVideo);
});

// Instagram TV
test('Instagram TV', async () => {
  const tv = await instagram(igTV);
});

// Instagram SideCar
test('Instagram Video', async () => {
  const sideCar = await instagram(igSideCar);
});

// Instagram Story
test('Instagram Video', async () => {
  const story = await instagram(igStory);
});
