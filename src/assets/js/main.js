document.addEventListener('DOMContentLoaded', () => {
    loadDescription();
    loadRepos();
    loadFollowers();
});

async function loadDescription() {
    const req = await fetch('https://api.github.com/users/dev2forge');
    // const res = await req.json();

    // Markdown to HTML conversion
    const converter = new showdown.Converter({ tables: true });
    const readme = await fetch('https://raw.githubusercontent.com/Dev2Forge/.github/refs/heads/main/profile/README.md');
    const readmeText = await readme.text();
    const html_readme = converter.makeHtml(readmeText);

    const description = document.querySelector('#description');
    // description.innerHTML = res.bio || 'No description available';
    description.innerHTML = html_readme || '';
    __formatHTML(description);
}

/**
 * Load repositories from GitHub API and display them in a grid.
 * Each repository is displayed in a card format with its name, description, and a link to the repo.
 */
async function loadRepos() {
    const container = document.querySelector('#carrusel-repos');
    const configsWeb = await loadConfigs();
    try {
        const res = await fetch('https://api.github.com/orgs/dev2forge/repos');
        const repos = await res.json();
        repos.forEach((repo) => {
            // Skip repositories that are not in the configsWeb list
            if (!configsWeb.ignoreRepos.includes(repo.name)) {
                const card = document.createElement('div');
                card.className = 'flex flex-col justify-between items-center w-64 h-64 bg-gray-100 dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition snap-start row-span-1';
                card.innerHTML = `
                <h2 class="text-xl font-semibold text-center w-full mb-2">${repo.name}</h2>
                <div class="flex-1 w-full overflow-y-auto mb-2 no-scrollbar">
                    <p class="text-sm text-gray-600 dark:text-gray-300 text-center break-words">${repo.description || 'No description'}</p>
                </div>
                <div class="w-full flex justify-center mt-auto gap-3">
                    <a href="${repo.html_url}" target="_blank" class="btn-repo-link flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 shadow hover:scale-110 hover:bg-blue-500 hover:text-white transition border border-blue-300 dark:border-blue-700 mr-0.5">
                        <img width="24" height="24" src="https://cdn.jsdelivr.net/gh/tutosrive/images-projects-srm-trg@refs/heads/main/svg-icons-flags-cursor/icon/github-logo.svg" alt="GitHub">
                    </a>
                    <a href="${repo.homepage}" target="_blank" class="btn-repo-link flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 shadow hover:scale-110 hover:bg-blue-500 hover:text-white transition border border-blue-300 dark:border-blue-700 ml-0.5">
                        <img width="16" height="16" src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/box-arrow-up-right.svg" alt="Icon redirect">
                    </a>
                </div>
            `;
                container.appendChild(card);
            }
        });
    } catch (e) {
        container.innerHTML = '<p class="text-red-500">Failed to load repositories.</p>';
    }
}

/**
 * Load followers from GitHub API and display them as a horizontal avatar carousel.
 * Only the profile pictures are shown, as per the new design.
 */
async function loadFollowers() {
    const req = await fetch('https://api.github.com/users/Dev2Forge/followers');
    const response = await req.json();
    const container = document.querySelector('#followers-container');
    response.forEach((follower) => {
        const img = document.createElement('img');
        img.src = follower.avatar_url;
        img.alt = follower.login;
        img.title = follower.login;
        img.className = 'w-20 h-20 rounded-full object-cover snap-center border-2 border-gray-300 dark:border-gray-700 cursor-pointer transition hover:scale-110';
        img.onclick = () => window.open(follower.html_url, '_blank');
        container.appendChild(img);
    });
}

async function loadConfigs() {
    const req = await fetch('src/assets/json/configs.json');
    const data = await req.json();
    return data;
}

function __formatHTML(container) {
    // Set scrollable tables within the container
    __setScrollableTables(container);

    // Add event listener to handle click events on links
    const titleMD = document.querySelector('#dev2forge');
    const thumbnail = document.querySelector('#thumbnail-dev2forge');
    // document.querySelector('#title-page').innerHTML = titleMD.innerHTML;
    titleMD.remove();
    container.querySelectorAll('img').forEach(async (img) => {
        const config = await loadConfigs();
        if (img.src === config.thumbnail1) {
            thumbnail.src = img.src;
            img.remove();
        }
    });
}

/**
 * Set scrollable tables within a container.
 * @param {HTMLElement} container Container element where tables are located.
 */
function __setScrollableTables(container) {
    container.querySelectorAll('table').forEach((table) => {
        table.classList.add('markdown-table');
        const wrapper = document.createElement('div');
        wrapper.className = 'markdown-table-wrapper';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
}
