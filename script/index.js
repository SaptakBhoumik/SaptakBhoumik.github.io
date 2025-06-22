document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    // Function to show a specific section
    const showSection = (targetId) => {
        contentSections.forEach(section => {
            if (section.id === targetId) {
                section.style.display = 'block';
                // Trigger reflow to ensure transition works
                section.offsetWidth;
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            } else {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)'; // Move slightly down before hiding
                // Hide after transition
                setTimeout(() => {
                    section.style.display = 'none';
                }, 500); // Match transition duration
            }
        });

        // Update active link styling
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${targetId}`) {
                link.classList.add('bg-gray-800', 'text-white');
                link.classList.remove('text-gray-300', 'hover:text-white');
            } else {
                link.classList.remove('bg-gray-800', 'text-white');
                link.classList.add('text-gray-300', 'hover:text-white');
            }
        });
    };

    // Handle initial section display based on URL hash or default to home
    const initialHash = window.location.hash.substring(1); // Remove '#'
    if (initialHash && document.getElementById(initialHash)) {
        showSection(initialHash);
    } else {
        showSection('home'); // Default to home section
    }

    // Event listeners for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor jump
            const targetId = e.target.getAttribute('href').substring(1);
            showSection(targetId);

            // Update URL hash without page reload for history
            history.pushState(null, '', `#${targetId}`);

            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const currentHash = window.location.hash.substring(1);
        if (currentHash && document.getElementById(currentHash)) {
            showSection(currentHash);
        } else {
            showSection('home'); // Fallback if hash is empty or invalid
        }
    });

    // Create additional stars
    const createStars = () => {
        const starsContainer = document.body;
        for (let i = 0; i < 20; i++) {
            const star = document.createElement('div');
            star.className = 'star animate-twinkle';
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            starsContainer.appendChild(star);
        }
    };

    createStars();

    // Project Filtering and Search
    const searchInput = document.getElementById('project-search');
    const filterDropdown = document.getElementById('project-filter-dropdown');
    const projectItems = document.querySelectorAll('.project-item');

    let activeTag = 'all';

    const filterProjects = () => {
        const searchQuery = searchInput.value.toLowerCase();
        activeTag = filterDropdown.value;

        projectItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            const tags = item.dataset.tags.split(' ');

            const searchMatch = title.includes(searchQuery) || description.includes(searchQuery);
            const tagMatch = activeTag === 'all' || tags.includes(activeTag);

            if (searchMatch && tagMatch) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    };

    searchInput.addEventListener('input', filterProjects);
    filterDropdown.addEventListener('change', filterProjects);
});