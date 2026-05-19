import p5 from 'p5';
import { CATEGORIES, PROJECTS } from './data/projects.js';

// --- Global State ---
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let searchQuery = '';
let currentPath = window.location.pathname;
let activeP5Instance = null;

// --- DOM References ---
const mainContent = document.getElementById('content');
const categorySidebarList = document.getElementById('sidebar-categories');
const searchInput = document.getElementById('search');
const projectCountEl = document.getElementById('footer-stats');

// --- Helper Functions ---

const saveFavorites = () => {
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateUI();
};

const toggleFavorite = (id) => {
  favorites = favorites.includes(id) 
    ? favorites.filter(f => f !== id) 
    : [...favorites, id];
  saveFavorites();
};

const updateUI = () => {
    // Update Sidebar
    renderSidebar();
    // Re-render current view
    renderView();
    // Update project count
    if (projectCountEl) {
        projectCountEl.textContent = `${PROJECTS.length} Total Experiments`;
    }
};

// --- Routing ---

window.handleLink = (e, path) => {
  e.preventDefault();
  navigateTo(path);
};

const navigateTo = (path) => {
  window.history.pushState({}, '', path);
  currentPath = path;
  renderView();
};

window.navigateTo = navigateTo;

window.addEventListener('popstate', () => {
  currentPath = window.location.pathname;
  renderView();
});

// --- Search ---

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderView();
    });
}

// --- View Rendering ---

const renderSidebar = () => {
  if (!categorySidebarList) return;
  
  // Update Navigation links
  const navDashboard = document.getElementById('link-dashboard');
  const navFavorites = document.getElementById('link-favorites');
  
  if (navDashboard) {
    navDashboard.className = currentPath === '/' ? 'side-link-active' : 'side-link';
  }
  if (navFavorites) {
    navFavorites.className = currentPath === '/favorites' ? 'side-link-active' : 'side-link';
  }

  // Update Categories
  categorySidebarList.innerHTML = CATEGORIES.map(cat => {
    const isActive = currentPath === `/category/${cat.id}`;
    return `
      <a href="/category/${cat.id}" 
         onclick="handleLink(event, '/category/${cat.id}')"
         class="${isActive ? 'side-link-active' : 'side-link'} block w-full text-left text-sm">
        # ${cat.title.toLowerCase()}
      </a>
    `;
  }).join('');
};

const renderView = () => {
  renderSidebar();
  if (!mainContent) return;
  
  if (activeP5Instance) {
    activeP5Instance.remove();
    activeP5Instance = null;
  }

  if (searchQuery) {
    renderSearchView();
    return;
  }

  if (currentPath === '/') {
    renderHomeView();
  } else if (currentPath.startsWith('/category/')) {
    const categoryId = currentPath.split('/').pop();
    renderCategoryDetailView(categoryId);
  } else if (currentPath.startsWith('/project/')) {
    const projectId = currentPath.split('/').pop();
    renderProjectDetailView(projectId);
  } else if (currentPath === '/favorites') {
    renderFavoritesView();
  }
};

const createProjectCard = (project) => {
  const isFav = favorites.includes(project.id);
  const card = document.createElement('div');
  card.className = "simple-card project-card cursor-pointer";
  card.onclick = () => navigateTo(`/project/${project.id}`);
  
  card.innerHTML = `
    <div class="project-media-wrapper">
      <div id="preview-container-${project.id}" class="project-preview"></div>
      
      <button class="btn-fav">
        <svg class="w-5 h-5 ${isFav ? 'filled' : ''}" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
      </button>
    </div>

    <div class="project-body">
      <div class="project-header">
        <h4 class="project-title">${project.title}</h4>
        <span class="project-category-badge">
          ${project.category}
        </span>
      </div>
      <p class="project-desc">"${project.description}"</p>
      
      <div class="project-footer">
        <span>Click to enter Lab</span>
        <span class="status-indicator">
          <span class="dot dot-green"></span>
          Ready
        </span>
      </div>
    </div>
  `;

  const favBtn = card.querySelector('.btn-fav');

  favBtn.onclick = (e) => {
    e.stopPropagation();
    const isCurrentlyFav = favorites.includes(project.id);
    if (isCurrentlyFav) {
      favorites = favorites.filter(f => f !== project.id);
      favBtn.querySelector('svg').classList.remove('filled');
      favBtn.querySelector('svg').setAttribute('fill', 'none');
    } else {
      favorites.push(project.id);
      favBtn.querySelector('svg').classList.add('filled');
      favBtn.querySelector('svg').setAttribute('fill', 'currentColor');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Update sidebar without full re-render if possible
    renderSidebar();
    if (projectCountEl) {
        projectCountEl.textContent = `${PROJECTS.length} Total Experiments`;
    }
  };

  return card;
};

const renderProjectDetailView = (projectId) => {
  const project = PROJECTS.find(p => p.id === projectId);
  if (!project) return renderHomeView();

  if (activeP5Instance) {
    activeP5Instance.remove();
    activeP5Instance = null;
  }

  const isFav = favorites.includes(project.id);

  mainContent.innerHTML = `
    <div class="view-container">
      <button onclick="navigateTo('/category/${project.category}')" class="btn-back">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        Back to ${project.category}
      </button>

      <div class="lab-workspace">
        <div class="lab-header">
          <div class="lab-info">
            <h2 class="view-title-bold">${project.title}</h2>
            <p class="view-subtitle">${project.description}</p>
          </div>
          <div class="lab-actions">
            <button id="run-lab" class="btn-primary" style="height: fit-content; padding: 0.75rem 2rem; font-size: 12px;">Run Sketch</button>
            <button id="stop-lab" class="btn-secondary" style="height: fit-content; padding: 0.75rem 2rem; font-size: 12px; margin-left: 0.75rem;">Stop Sketch</button>
          </div>
        </div>

        <div class="lab-stage-container">
          <div id="lab-canvas-container" class="lab-canvas-mount"></div>
          
          <button id="detail-fav-btn" class="btn-fav" style="top: 2rem; right: 2rem;">
            <svg class="w-6 h-6 ${isFav ? 'filled' : ''}" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
        </div>

        <div class="lab-controls-panel">
          <h3 class="sidebar-label" style="margin-bottom: 2rem;">Configuration</h3>
          <div class="lab-controls-grid" id="controls-mount">
            ${project.controls ? project.controls.map(c => `
              <div class="control-group">
                <div class="control-label-row">
                  <label class="control-label" for="${c.id}">${c.id}</label>
                  <span id="${c.id}-value" class="control-value">${c.default}</span>
                </div>
                <input 
                  type="${c.type}" 
                  id="${c.id}" 
                  class="control-input" 
                  min="${c.min}" 
                  max="${c.max}" 
                  step="${c.step}" 
                  value="${c.default}"
                />
              </div>
            `).join('') : '<p class="text-white/20 italic text-sm">No adjustable parameters for this sketch.</p>'}
          </div>
        </div>
      </div>
    </div>
  `;

  const canvasMount = document.getElementById('lab-canvas-container');
  const runBtn = document.getElementById('run-lab');
  const favBtn = document.getElementById('detail-fav-btn');
  
  activeP5Instance = new p5((pInst) => {
    project.sketch(pInst);
    const originalSetup = pInst.setup;
    pInst.setup = () => {
      if (originalSetup) originalSetup();
      pInst.redraw();
      pInst.noLoop();
    };
  }, canvasMount);

  favBtn.onclick = (e) => {
    const isCurrentlyFav = favorites.includes(project.id);
    if (isCurrentlyFav) {
      favorites = favorites.filter(f => f !== project.id);
      favBtn.querySelector('svg').classList.remove('filled');
      favBtn.querySelector('svg').setAttribute('fill', 'none');
    } else {
      favorites.push(project.id);
      favBtn.querySelector('svg').classList.add('filled');
      favBtn.querySelector('svg').setAttribute('fill', 'currentColor');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderSidebar();
  };

  const stopBtn = document.getElementById('stop-lab');

  if (project.controls) {
    project.controls.forEach(c => {
      const input = document.getElementById(c.id);
      const valueDisplay = document.getElementById(`${c.id}-value`);
      if (input && valueDisplay) {
        valueDisplay.textContent = input.value;
        input.addEventListener('input', () => {
          valueDisplay.textContent = input.value;
        });
      }
    });
  }

  runBtn.onclick = () => {
    const params = {};
    if (project.controls) {
      project.controls.forEach(c => {
        params[c.id] = parseFloat(document.getElementById(c.id).value);
      });
    }

    if (project.oneShot) {
      if (activeP5Instance) {
        activeP5Instance.redraw();
        activeP5Instance.noLoop();
      }
      return;
    }

    if (activeP5Instance && activeP5Instance.updateParams) {
      activeP5Instance.updateParams(params);
      activeP5Instance.loop();
      return;
    }

    if (project.controls) {
      // Fallback for sketches that don't support partial updates.
      activeP5Instance.remove();
      activeP5Instance = new p5((pInst) => {
        project.sketch(pInst);
        const originalSetup = pInst.setup;
        pInst.setup = () => {
          if (originalSetup) originalSetup();
          pInst.redraw();
        };
      }, canvasMount);
      return;
    }

    if (activeP5Instance) {
      activeP5Instance.loop();
    }
  };

  stopBtn.onclick = () => {
    if (activeP5Instance) {
      activeP5Instance.noLoop();
    }
  };
};

const renderHomeView = () => {
  mainContent.innerHTML = `
    <div class="view-container">
      <header class="view-header">
        <div>
          <h2 class="view-title">Project Categories</h2>
          <p class="view-subtitle">Select a territory to explore specialized creative code experiments.</p>
        </div>
      </header>
      <div class="grid md:grid-cols-2" id="grid-categories"></div>
    </div>
  `;

  const grid = document.getElementById('grid-categories');
  CATEGORIES.forEach(cat => {
    const card = document.createElement('div');
    card.onclick = () => navigateTo(`/category/${cat.id}`);
    card.className = "simple-card";
    card.innerHTML = `
      <div class="card-media">
        <img src="${cat.previewUrl}" class="card-img" />
        <div class="card-badge-container">
          <span class="card-badge">
            ${PROJECTS.filter(p => p.category === cat.id).length} Projects
          </span>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${cat.title}</h3>
        <p class="card-desc">${cat.description}</p>
        <div class="card-footer">
          <span class="card-meta">Updated Recently</span>
          <button class="btn-primary">View Collection</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
};

const renderCategoryDetailView = (categoryId) => {
  const category = CATEGORIES.find(c => c.id === categoryId);
  const projects = PROJECTS.filter(p => p.category === categoryId);

  mainContent.innerHTML = `
    <div class="view-container">
      <button onclick="navigateTo('/')" class="btn-back">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Home
      </button>
      <header class="view-header-alt">
        <h2 class="view-title-bold">${category.title}</h2>
        <p class="view-subtitle-large">${category.description}</p>
      </header>
      <div class="grid md:grid-cols-2 lg:grid-cols-3" id="grid-projects"></div>
    </div>
  `;

  const grid = document.getElementById('grid-projects');
  projects.forEach(p => {
    const card = createProjectCard(p);
    grid.appendChild(card);
    // Initialize preview after append
    const previewContainer = card.querySelector(`#preview-container-${p.id}`);
    new p5((pInst) => {
      p.sketch(pInst);
      const originalSetup = pInst.setup;
      pInst.setup = () => {
        if (originalSetup) originalSetup();
        pInst.redraw();
        pInst.noLoop();
      };
    }, previewContainer);
  });
};

const renderFavoritesView = () => {
    const favProjects = PROJECTS.filter(p => favorites.includes(p.id));
    mainContent.innerHTML = `
        <div class="view-container">
            <h2 class="view-title-fav">
                <svg class="icon-large filled" fill="none" stroke="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>
                Favorites
            </h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3" id="grid-favorites"></div>
        </div>
    `;

    const grid = document.getElementById('grid-favorites');
    if (favProjects.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center py-24 opacity-40">No favorites yet. Go explore!</p>';
    } else {
        favProjects.forEach(p => {
            const card = createProjectCard(p);
            grid.appendChild(card);
            const previewContainer = card.querySelector(`#preview-container-${p.id}`);
            new p5((pInst) => {
                p.sketch(pInst);
                const originalSetup = pInst.setup;
                pInst.setup = () => {
                    if (originalSetup) originalSetup();
                    pInst.redraw();
                    pInst.noLoop();
                };
            }, previewContainer);
        });
    }
};

const renderSearchView = () => {
    const filtered = PROJECTS.filter(p => 
        p.title.toLowerCase().includes(searchQuery) || 
        p.description.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery)
    );

    mainContent.innerHTML = `
        <div class="view-container">
            <h2 class="view-title-bold">Search results for "${searchQuery}"</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3" id="grid-search"></div>
        </div>
    `;

    const grid = document.getElementById('grid-search');
    if (filtered.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center py-24 opacity-40">No results found.</p>';
    } else {
        filtered.forEach(p => {
            const card = createProjectCard(p);
            grid.appendChild(card);
            const previewContainer = card.querySelector(`#preview-container-${p.id}`);
            new p5((pInst) => {
                p.sketch(pInst);
                const originalSetup = pInst.setup;
                pInst.setup = () => {
                    if (originalSetup) originalSetup();
                    pInst.redraw();
                    pInst.noLoop();
                };
            }, previewContainer);
        });
    }
};

// --- Init ---
updateUI();
renderSidebar();
renderView();
