const form = document.querySelector('#search');
const query = document.querySelector('#query');
const results = document.querySelector('#recommendations');
const cards = document.querySelector('#cards');
const status = document.querySelector('#status');
const heading = document.querySelector('#result-heading');

async function loadDestinations() {
  const response = await fetch('./travel_recommendation_api.json');
  if (!response.ok) throw new Error('Could not load recommendations');
  return response.json();
}

let latestSearch = 0;

async function search(value) {
  const request = ++latestSearch;
  const term = value.trim().toLowerCase();
  cards.replaceChildren();
  results.hidden = false;
  heading.textContent = 'Recommendations';
  status.textContent = 'Loading destinations…';
  try {
    const data = await loadDestinations();
    if (request !== latestSearch) return;
    const matches = {
      beach: data.beaches, beaches: data.beaches,
      temple: data.temples, temples: data.temples
    };
    const country = data.countries.find(entry => entry.name.toLowerCase() === term);
    const destinations = Object.hasOwn(matches, term) ? matches[term] : country?.cities ?? [];
    heading.textContent = country?.name ?? 'Recommendations';
    status.textContent = destinations.length ? '' : 'Try beaches, temples, or Japan.';
    for (const {name, imageUrl, description} of destinations) {
      const card = document.createElement('article');
      const image = document.createElement('img');
      image.src = imageUrl;
      image.alt = name;
      const title = document.createElement('h3');
      title.textContent = name;
      const copy = document.createElement('p');
      copy.textContent = description;
      card.append(image, title, copy);
      cards.append(card);
    }
  } catch {
    if (request === latestSearch) status.textContent = 'Could not load destinations. Try again.';
  }
  if (request === latestSearch) results.scrollIntoView({block: 'nearest'});
}

form.addEventListener('submit', event => {
  event.preventDefault();
  search(query.value);
});
form.addEventListener('reset', () => {
  latestSearch++;
  results.hidden = true;
  cards.replaceChildren();
});
for (const button of document.querySelectorAll('[data-query]')) {
  button.addEventListener('click', () => {
    query.value = button.dataset.query;
    search(query.value);
  });
}
