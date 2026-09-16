const repositoryList = document.querySelector('#repository-list');
const repositoryCount = document.querySelector('#repository-count');

const formatDate = (dateString) => new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
}).format(new Date(dateString));

const formatStars = (count) => new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1
}).format(count);

const createRepositoryCard = ({ repo, created_at: createdAt }) => {
  const article = document.createElement('article');
  article.className = 'repository-card';

  const details = document.createElement('div');
  const link = document.createElement('a');
  link.className = 'repository-name';
  link.href = repo.html_url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = repo.name;

  const description = document.createElement('p');
  description.className = 'repository-description';
  description.textContent = repo.description || 'No description provided.';

  const metadata = document.createElement('div');
  metadata.className = 'repository-meta';
  metadata.innerHTML = `<span>${repo.language || 'Open source'}</span><span>Starred ${formatDate(createdAt)}</span>`;

  details.append(link, description, metadata);

  const stars = document.createElement('span');
  stars.className = 'repository-stars';
  stars.textContent = `★ ${formatStars(repo.stargazers_count)}`;

  article.append(details, stars);
  return article;
};

const renderRepositories = (events) => {
  const repositories = events
    .filter((event) => event.type === 'WatchEvent' && event.repo)
    .sort((first, second) => new Date(second.created_at) - new Date(first.created_at));

  repositoryCount.textContent = `${repositories.length} ${repositories.length === 1 ? 'repository' : 'repositories'}`;
  repositoryList.replaceChildren(...repositories.map(createRepositoryCard));
};

const loadRepositories = async () => {
  try {
    const response = await fetch('events.json');
    if (!response.ok) {
      throw new Error(`Could not load events.json (${response.status})`);
    }
    renderRepositories(await response.json());
  } catch (error) {
    repositoryCount.textContent = 'Unavailable';
    repositoryList.innerHTML = '<p class="status-message">Repositories could not be loaded. Please try again.</p>';
    console.error(error);
  }
};

loadRepositories();