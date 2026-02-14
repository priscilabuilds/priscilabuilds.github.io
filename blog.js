// ============================================
// CONFIGURACIÓN DEL BLOG
// ============================================

// Lista de posts con secciones y tags
// Estructura de cada post:
// {
//     id: 'nombre-del-archivo',           // Nombre del archivo sin .html
//     title: 'Título del Post',            // Título que se muestra
//     excerpt: 'Descripción breve...',     // Resumen del post
//     section: 'research',                 // Sección principal: portfolio, research, wellness, diy
//     tags: ['NEUROCIENCIA', 'COGNITION'], // Tags/subtemas (pueden ser varios)
//     date: '15 Feb 2026',                 // Fecha
//     readTime: '5 min',                   // Tiempo de lectura
//     image: 'url-de-imagen'               // Imagen (opcional)
// }

const posts = [
    {
        id: 'ejemplo-research-neurociencia',
        title: 'Introducción a la Neuroplasticidad',
        excerpt: 'Cómo el cerebro se adapta y cambia a lo largo de nuestra vida.',
        section: 'research',
        tags: ['NEUROCIENCIA', 'COGNICIÓN'],
        date: '15 Feb 2026',
        readTime: '7 min',
        image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80'
    },
    {
        id: 'ejemplo-research-food',
        title: 'La Química del Sabor Umami',
        excerpt: 'Explorando el quinto sabor básico y su impacto en la gastronomía moderna.',
        section: 'research',
        tags: ['FOOD SCIENCE', 'QUÍMICA'],
        date: '14 Feb 2026',
        readTime: '6 min',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80'
    },
    {
        id: 'ejemplo-wellness',
        title: 'Rutina Matutina para Mejor Energía',
        excerpt: 'Cinco hábitos simples que transformaron mis mañanas.',
        section: 'wellness',
        tags: ['RUTINAS', 'ENERGÍA'],
        date: '13 Feb 2026',
        readTime: '5 min',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80'
    },
    {
        id: 'ejemplo-diy',
        title: 'Organizador de Escritorio Minimalista',
        excerpt: 'Proyecto DIY usando madera reciclada - paso a paso con fotos.',
        section: 'diy',
        tags: ['WOODWORK', 'ORGANIZACIÓN'],
        date: '12 Feb 2026',
        readTime: '10 min',
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80'
    },
    {
        id: 'ejemplo-portfolio',
        title: 'Rediseño de Interfaz para App Móvil',
        excerpt: 'Case study: mejorando la experiencia de usuario en una app de productividad.',
        section: 'portfolio',
        tags: ['UX/UI', 'MOBILE'],
        date: '11 Feb 2026',
        readTime: '8 min',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80'
    }
];

// ============================================
// FUNCIONES DEL SISTEMA
// ============================================

let currentSection = 'home';
let currentTag = 'all';

// Obtener posts de una sección específica
function getPostsBySection(section) {
    if (section === 'home') {
        return posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
    }
    return posts.filter(post => post.section === section);
}

// Obtener todos los tags únicos de una sección
function getTagsBySection(section) {
    const sectionPosts = getPostsBySection(section);
    const tags = new Set();
    sectionPosts.forEach(post => {
        post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
}

// Renderizar la barra de tags para una sección
function renderTagsBar(section) {
    const tagsBar = document.getElementById('tagsBar');
    const tagsContainer = tagsBar.querySelector('.tags-container');
    
    // HOME y ABOUT no necesitan tags
    if (section === 'home' || section === 'about') {
        tagsBar.style.display = 'none';
        return;
    }
    
    const tags = getTagsBySection(section);
    
    if (tags.length === 0) {
        tagsBar.style.display = 'none';
        return;
    }
    
    tagsBar.style.display = 'block';
    
    // Resetear tags
    tagsContainer.innerHTML = '<button class="tag-btn active" data-tag="all">TODOS</button>';
    
    // Añadir tags de la sección
    tags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag-btn';
        btn.setAttribute('data-tag', tag);
        btn.textContent = tag;
        btn.addEventListener('click', () => filterByTag(tag));
        tagsContainer.appendChild(btn);
    });
    
    // Evento para botón "TODOS"
    const allBtn = tagsContainer.querySelector('[data-tag="all"]');
    allBtn.addEventListener('click', () => filterByTag('all'));
}

// Filtrar posts por tag dentro de la sección actual
function filterByTag(tag) {
    currentTag = tag;
    
    // Actualizar botones activos
    const tagButtons = document.querySelectorAll('.tag-btn');
    tagButtons.forEach(btn => {
        if (btn.getAttribute('data-tag') === tag) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Renderizar posts filtrados
    renderSectionPosts(currentSection, tag);
}

// Renderizar posts de una sección
function renderSectionPosts(section, tag = 'all') {
    let sectionPosts = getPostsBySection(section);
    
    // Filtrar por tag si no es "all"
    if (tag !== 'all') {
        sectionPosts = sectionPosts.filter(post => post.tags.includes(tag));
    }
    
    const containerId = section === 'home' ? 'homePostsGrid' : `${section}Posts`;
    const container = document.getElementById(containerId);
    const emptyStateId = `empty${section.charAt(0).toUpperCase() + section.slice(1)}`;
    const emptyState = document.getElementById(emptyStateId);
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (sectionPosts.length === 0) {
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        container.style.display = 'none';
        return;
    }
    
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    container.style.display = 'grid';
    
    sectionPosts.forEach((post, index) => {
        const postCard = document.createElement('article');
        postCard.className = 'post-card';
        postCard.style.animationDelay = `${index * 0.1}s`;
        postCard.onclick = () => window.location.href = `posts/${post.id}.html`;
        
        postCard.innerHTML = `
            ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image">` : ''}
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
            </div>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-excerpt">${post.excerpt}</p>
            <div class="post-meta">
                <span class="post-date">${post.date}</span>
                <span class="post-read-time">${post.readTime} lectura</span>
            </div>
        `;
        
        container.appendChild(postCard);
    });
}

// Cambiar de sección
function changeSection(section) {
    currentSection = section;
    currentTag = 'all';
    
    // Actualizar botones de sección
    const sectionButtons = document.querySelectorAll('.section-btn');
    sectionButtons.forEach(btn => {
        if (btn.getAttribute('data-section') === section) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Mostrar/ocultar secciones de contenido
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(sec => {
        sec.classList.remove('active');
    });
    
    const activeSection = document.getElementById(`section-${section}`);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    // Renderizar tags y posts de la sección
    renderTagsBar(section);
    
    if (section !== 'about') {
        renderSectionPosts(section);
    }
    
    // Scroll al top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Inicializar cuando la página carga
document.addEventListener('DOMContentLoaded', () => {
    // Event listeners para botones de sección
    const sectionButtons = document.querySelectorAll('.section-btn');
    sectionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section');
            changeSection(section);
        });
    });
    
    // Event listener para el logo (volver a HOME)
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => changeSection('home'));
    }
    
    // Cargar HOME por defecto
    changeSection('home');
});
