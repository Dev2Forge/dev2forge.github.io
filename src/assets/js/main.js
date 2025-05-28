document.addEventListener('DOMContentLoaded', () => {
    loadDescription();
    loadRepos();
    loadFollowers();
});

async function loadDescription() {
    const req = await fetch('https://api.github.com/users/dev2forge');
    const res = await req.json();
    const description = document.querySelector('#description');
    description.textContent = res.bio || 'No description available';
}

/**
 * Load repositories from GitHub API and display them in a grid.
 * Each repository is displayed in a card format with its name, description, and a link to the repo.
 */
async function loadRepos() {
    const container = document.querySelector('#carrusel-repos');
    try {
        const res = await fetch('https://api.github.com/orgs/dev2forge/repos');
        const repos = await res.json();
        repos.forEach((repo) => {
            const card = document.createElement('div');
            card.className = 'flex flex-col justify-between items-center w-64 h-64 bg-gray-100 dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition snap-start row-span-1';
            card.innerHTML = `
                <h2 class="text-xl font-semibold text-center w-full mb-2">${repo.name}</h2>
                <div class="flex-1 w-full overflow-y-auto mb-2 no-scrollbar">
                    <p class="text-sm text-gray-600 dark:text-gray-300 text-center break-words">${repo.description || 'No description'}</p>
                </div>
                <div class="w-full flex justify-center mt-auto">
                    <a href="${repo.html_url}" target="_blank" class="btn-repo-link inline-block text-center w-full">View Repo</a>
                </div>
            `;
            container.appendChild(card);
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
