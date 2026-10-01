/**
 * Logika JavaScript Utama Portofolio Azriel & Help Center
 * 
 * Mengelola rendering dinamis untuk:
 * 1. Projects Section di homepage (berurutan per kategori)
 * 2. Help Cards Section & Modal Detail di help/index.html
 */

// Memastikan fungsi berjalan saat DOM siap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function initApp() {
  // 1. Inisialisasi Halaman Utama (Projects) jika ada #projects-container
  const projectsData = getProjectsData();
  if (document.getElementById('projects-container')) {
    updateStats(projectsData);
    renderGroupedProjects(projectsData);
  }

  // 2. Inisialisasi Halaman Help jika ada #help-cards-container
  if (document.getElementById('help-cards-container')) {
    renderHelpCards();
  }
}

/* ==========================================================================
   FUNGSI HALAMAN UTAMA (PROJECTS)
   ========================================================================== */

function getProjectsData() {
  if (typeof projectsData !== 'undefined' && Array.isArray(projectsData)) {
    return projectsData;
  }
  if (typeof window !== 'undefined' && Array.isArray(window.projectsData)) {
    return window.projectsData;
  }
  return [];
}

function updateStats(data) {
  const totalProjectsStat = document.getElementById('stat-total-projects');
  const categoriesStat = document.getElementById('stat-categories');
  const contributionsStat = document.getElementById('stat-contributions');

  if (!Array.isArray(data)) return;

  if (totalProjectsStat) {
    totalProjectsStat.textContent = data.length;
  }

  if (categoriesStat) {
    const uniqueCats = new Set(data.map(p => p.category));
    categoriesStat.textContent = uniqueCats.size;
  }

  if (contributionsStat) {
    const totalStars = data.reduce((acc, curr) => acc + (curr.stars || 0), 0);
    contributionsStat.textContent = `${totalStars}+`;
  }
}

const categoryMeta = {
  'Web': {
    title: 'Project Web',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
  },
  'Python': {
    title: 'Project Python',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`
  },
  'Flutter': {
    title: 'Project Flutter',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
  },
  'Android': {
    title: 'Project Android',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`
  },
  'Scripting': {
    title: 'Project Scripting',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`
  },
  'Contribution': {
    title: 'Project Contribution',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`
  }
};

function renderGroupedProjects(data) {
  const projectsContainer = document.getElementById('projects-container');
  if (!projectsContainer || !Array.isArray(data)) return;

  const categoryOrder = ['Web', 'Python', 'Flutter', 'Android', 'Scripting', 'Contribution'];

  const grouped = {};
  data.forEach(p => {
    const cat = p.category || 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  });

  const sortedCategories = [
    ...categoryOrder.filter(cat => grouped[cat] && grouped[cat].length > 0),
    ...Object.keys(grouped).filter(cat => !categoryOrder.includes(cat) && grouped[cat].length > 0)
  ];

  if (sortedCategories.length === 0) {
    projectsContainer.innerHTML = `
      <div class="empty-state">
        <p class="empty-desc">Belum ada data project yang tersedia di projects.js.</p>
      </div>
    `;
    return;
  }

  projectsContainer.innerHTML = sortedCategories.map(cat => {
    const projectsList = grouped[cat];
    const meta = categoryMeta[cat] || {
      title: `Project ${cat}`,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`
    };

    const cardsHTML = projectsList.map(project => renderCardHTML(project)).join('');

    return `
      <section class="category-group" data-category="${cat}">
        <div class="category-group-header">
          <div class="category-group-title">
            <div class="category-title-icon">
              ${meta.icon}
            </div>
            <h2>${meta.title}</h2>
          </div>
          <span class="category-count-badge">${projectsList.length} Projects</span>
        </div>

        <div class="projects-grid">
          ${cardsHTML}
        </div>
      </section>
    `;
  }).join('');
}

function renderCardHTML(project) {
  const tagsHTML = (project.tags || []).map(tag => `<span class="tag-badge">${tag}</span>`).join('');

  const demoBtnHTML = project.demo ? `
    <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="card-link" title="Lihat Live Demo">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    </a>
  ` : '';

  const githubBtnHTML = project.github ? `
    <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="card-link" title="Lihat Source Code">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
    </a>
  ` : '';

  return `
    <article class="project-card" data-category="${project.category}">
      <div>
        <div class="card-top">
          <div class="card-icon">
            ${project.icon || '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'}
          </div>
          <span class="card-category-badge">${project.badge || project.category}</span>
        </div>
        
        <h3 class="card-title">${project.title}</h3>
        <p class="card-description">${project.description}</p>
        
        <div class="card-tags">
          ${tagsHTML}
        </div>
      </div>

      <div class="card-bottom">
        <div class="card-stats"></div>

        <div class="card-actions">
          ${githubBtnHTML}
          ${demoBtnHTML}
        </div>
      </div>
    </article>
  `;
}

/* ==========================================================================
   FUNGSI HALAMAN HELP (RENDER CARD-CARD & MODAL DETAIL)
   ========================================================================== */

function getHelpData() {
  if (typeof helpData !== 'undefined' && Array.isArray(helpData)) {
    return helpData;
  }
  if (typeof window !== 'undefined' && Array.isArray(window.helpData)) {
    return window.helpData;
  }
  return [];
}

function renderHelpCards() {
  const container = document.getElementById('help-cards-container');
  const data = getHelpData();

  if (!container || !Array.isArray(data)) return;

  if (data.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p class="empty-desc">Belum ada data bantuan yang tersedia di assets/js/help.js.</p>
      </div>
    `;
    return;
  }

  // Render Kartu Sesuai Desain pada Gambar Contoh
  container.innerHTML = data.map(item => {
    return `
      <article class="help-card" data-id="${item.id}">
        <!-- Gambar Sampul Atas dengan Latar Belakang Tint -->
        <div class="help-card-cover" style="background-color: ${item.bgTint || '#fef08a'};">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
        </div>

        <!-- Pagination Dots -->
        <div class="help-card-dots">
          <span class="dot active"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>

        <!-- Konten Kartu -->
        <div class="help-card-body">
          <div class="help-card-header">
            <h3 class="help-card-title">${item.title}</h3>
            <span class="help-card-price">${item.price}</span>
          </div>

          <div class="help-card-desc-wrapper">
            <span class="help-desc-label">DESCRIPTION</span>
            <p class="help-card-short-desc">${item.shortDescription}</p>
          </div>

          <!-- Tombol Aksi Full Width -->
          <button type="button" class="help-action-btn" data-action="open-detail">
            ${item.buttonText || 'Download'}
          </button>
        </div>
      </article>
    `;
  }).join('');

  // Pasang Event Listener untuk Membuka Modal Rincian
  setupHelpModalEvents(data);
}

function setupHelpModalEvents(data) {
  const container = document.getElementById('help-cards-container');
  const modal = document.getElementById('help-modal');
  if (!container || !modal) return;

  // Klik Kartu untuk Membuka Modal
  container.addEventListener('click', (e) => {
    const card = e.target.closest('.help-card');
    if (!card) return;

    const id = card.dataset.id;
    const item = data.find(d => d.id === id);
    if (item) {
      openHelpModal(item);
    }
  });

  // Tombol Close Modal & Klik Backdrop
  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('help-modal-overlay') || e.target.closest('.help-modal-close')) {
      closeHelpModal();
    }
  });

  // Tekan Tombol Escape untuk Menutup Modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeHelpModal();
    }
  });
}

function openHelpModal(item) {
  const modal = document.getElementById('help-modal');
  const modalLeft = document.getElementById('help-modal-left');
  const modalRight = document.getElementById('help-modal-right');
  if (!modal || !modalLeft || !modalRight) return;

  // Kolom Kiri: Gambar
  modalLeft.innerHTML = `
    <div class="modal-cover-wrapper" style="background-color: ${item.bgTint || '#fef08a'};">
      <img src="${item.image}" alt="${item.title}" />
    </div>
  `;

  // Kolom Kanan: Informasi & Deskripsi Rincian (fullDescription) + Tombol Aksi yang Sama
  modalRight.innerHTML = `
    <button type="button" class="help-modal-close" aria-label="Close Modal">&times;</button>
    <div class="modal-header-info">
      <span class="modal-price-badge">${item.price}</span>
      <h2 class="modal-title">${item.title}</h2>
    </div>

    <div class="modal-desc-section">
      <span class="help-desc-label">DETAIL DESCRIPTION</span>
      <p class="modal-full-desc">${item.fullDescription}</p>
    </div>

    <div class="modal-action-footer">
      <a href="${item.buttonUrl || '#'}" class="help-action-btn modal-action-btn">
        ${item.buttonText || 'Download'}
      </a>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Lock scroll saat modal terbuka
}

function closeHelpModal() {
  const modal = document.getElementById('help-modal');
  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';
}
