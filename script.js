/**
 * Netflix Clone — script.js
 * Activity 2: JavaScript Interactivity
 *
 * Features implemented:
 *  1. Button Click Interaction  — "Join Now" / "Watch Now" custom modal
 *  2. Form Validation           — Footer email form with dynamic error messages
 *  3. Dynamic Content Change    — Light / Dark theme toggle stored in localStorage
 *  4. Show / Hide Sections      — FAQ accordion powered by vanilla JS
 *  5. Interactive Navigation    — Sticky header + active nav-link highlight
 *  6. CineSketch Generator      — Random scene-seed on button click (DOM manipulation)
 *  7. Film Time Capsule (Bonus) — localStorage-backed capsule form & live display
 *
 * JavaScript concepts used:
 *  DOM selection & manipulation, event listeners, classList API,
 *  template literals, localStorage, array methods, form events,
 *  regex validation, scroll events, conditional logic.
 */

/* ============================================================
   FEATURE 5 — STICKY HEADER & ACTIVE NAV LINK
   ============================================================ */

const navbar = document.querySelector('.navbar');

// Make the navbar sticky and add a shadow when the user scrolls down
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Highlight the nav link that was last clicked
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function () {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active-nav'));
        // Add active class to the clicked link
        this.classList.add('active-nav');
    });
});


/* ============================================================
   FEATURE 1 — BUTTON CLICK INTERACTION (Custom Modal)
   ============================================================ */

/**
 * Opens the custom modal with a given title and message.
 * @param {string} title   - Modal heading text
 * @param {string} message - Modal body text
 */
function openModal(title, message) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('customModal').classList.add('modal-visible');
}

/** Closes the custom modal. */
function closeModal() {
    document.getElementById('customModal').classList.remove('modal-visible');
}

// "Join Now" button in the hero section
const joinNowBtn = document.getElementById('joinNowBtn');
if (joinNowBtn) {
    joinNowBtn.addEventListener('click', () => {
        openModal(
            '🎬 Welcome to Netflix!',
            'Start your free trial today and enjoy unlimited movies, series, and more. Cancel anytime.'
        );
    });
}

// "Watch Now" button in Tonight's Pick section
const watchNowBtn = document.getElementById('watchNowBtn');
if (watchNowBtn) {
    watchNowBtn.addEventListener('click', () => {
        openModal(
            '▶ Now Playing — Jolly LLB 3',
            'Streaming in 4K Dolby Vision. Enjoy the show! (This is a demo — no real video plays.)'
        );
    });
}

// "My List" button in Tonight's Pick section
const myListBtn = document.getElementById('myListBtn');
if (myListBtn) {
    myListBtn.addEventListener('click', () => {
        myListBtn.textContent = '✔ Added to List';
        myListBtn.classList.remove('btn-outline-light');
        myListBtn.classList.add('btn-success');
        myListBtn.disabled = true;
    });
}

// Close modal when clicking the × button or the backdrop
document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
document.getElementById('customModal').addEventListener('click', function (e) {
    if (e.target === this) closeModal(); // click outside modal box
});


/* ============================================================
   FEATURE 2 — FORM VALIDATION (Footer email form)
   ============================================================ */

const emailForm = document.getElementById('emailForm');
const emailInput = document.getElementById('emailInput');
const emailError = document.getElementById('emailError');
const emailSuccess = document.getElementById('emailSuccess');

if (emailForm) {
    emailForm.addEventListener('submit', function (e) {
        e.preventDefault(); // prevent page reload

        const value = emailInput.value.trim();

        // Reset previous messages
        emailError.textContent = '';
        emailSuccess.textContent = '';
        emailInput.classList.remove('input-error', 'input-ok');

        // Validation rule 1 — empty field
        if (value === '') {
            emailError.textContent = '⚠ Email address cannot be empty.';
            emailInput.classList.add('input-error');
            return;
        }

        // Validation rule 2 — valid email format using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            emailError.textContent = '⚠ Please enter a valid email address (e.g. user@example.com).';
            emailInput.classList.add('input-error');
            return;
        }

        // All checks passed
        emailInput.classList.add('input-ok');
        emailSuccess.textContent = `✅ Great! We'll send your link to ${value}. Check your inbox!`;
        emailInput.value = '';
    });
}


/* ============================================================
   FEATURE 3 — DYNAMIC CONTENT CHANGE (Theme Toggle + localStorage)
   ============================================================ */

const themeToggleBtn = document.getElementById('themeToggleBtn');

/**
 * Applies the given theme ('light' or 'dark') to the page
 * and updates the toggle button label.
 * @param {string} theme
 */
function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        themeToggleBtn.textContent = '🌙 Dark Mode';
    } else {
        document.body.classList.remove('light-mode');
        themeToggleBtn.textContent = '☀ Light Mode';
    }
}

// On page load, restore saved theme preference from localStorage
const savedTheme = localStorage.getItem('netflixTheme') || 'dark';
applyTheme(savedTheme);

// Toggle theme on button click and persist the choice
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('netflixTheme', newTheme); // save to localStorage
    });
}


/* ============================================================
   FEATURE 4 — SHOW / HIDE SECTIONS (FAQ Accordion — Vanilla JS)
   ============================================================ */

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    question.addEventListener('click', () => {
        const isOpen = answer.classList.contains('faq-open');

        // Close all other open answers first
        faqItems.forEach(other => {
            other.querySelector('.faq-answer').classList.remove('faq-open');
            other.querySelector('.faq-icon').textContent = '+';
        });

        // Toggle the clicked one
        if (!isOpen) {
            answer.classList.add('faq-open');
            icon.textContent = '−';
        }
    });
});


/* ============================================================
   FEATURE 6 — CINESKETCH SCENE SEED GENERATOR (DOM Manipulation)
   ============================================================ */

// Pool of creative scene seeds
const sceneSeeds = [
    'A detective finds a love letter addressed to themselves — written in their own handwriting.',
    'Two strangers share an umbrella in a downpour; one of them is invisible to everyone else.',
    'A chef discovers the secret ingredient in their grandmother\'s recipe is a memory, not a spice.',
    'The last lighthouse keeper receives a distress signal from a ship that sank 50 years ago.',
    'A child draws a door on a wall — and someone knocks from the other side.',
    'An astronaut returns home to find their house exactly as they left it, but their family has no memory of them.',
    'A musician plays a song that makes everyone in the room cry — but they don\'t know why.',
    'Two rivals meet at a funeral and realise they\'re mourning different people in the same coffin.',
    'A librarian finds a book that predicts tomorrow\'s newspaper headlines — but it\'s 10 years old.',
    'A painter finishes a portrait of a stranger, only to find the stranger standing behind them.',
    'The city\'s last pay phone rings. No one has used it in 20 years.',
    'A time traveller arrives 5 minutes too late — every single time.',
    'A street performer\'s shadow keeps dancing after the music stops.',
    'A scientist proves that silence has a colour. Nobody believes them.',
    'An old photograph falls out of a library book — it shows the reader, as a child, reading the same book.',
];

let lastSeedIndex = -1;

/**
 * Returns a random scene seed, avoiding immediate repetition.
 * @returns {string}
 */
function getRandomSeed() {
    let idx;
    do {
        idx = Math.floor(Math.random() * sceneSeeds.length);
    } while (idx === lastSeedIndex);
    lastSeedIndex = idx;
    return sceneSeeds[idx];
}

const csPrompt = document.getElementById('csPrompt');
const csGenerate = document.getElementById('csGenerate');
const csRandomize = document.getElementById('csRandomize');

// "Get a Scene Seed" — shows the next seed in sequence
if (csGenerate) {
    csGenerate.addEventListener('click', () => {
        lastSeedIndex = (lastSeedIndex + 1) % sceneSeeds.length;
        csPrompt.textContent = `"${sceneSeeds[lastSeedIndex]}"`;
        csPrompt.style.color = '#e5e5e5';
    });
}

// "Surprise Me" — shows a truly random seed
if (csRandomize) {
    csRandomize.addEventListener('click', () => {
        csPrompt.textContent = `"${getRandomSeed()}"`;
        csPrompt.style.color = '#ff9f43'; // orange accent for surprise
    });
}


/* ============================================================
   FEATURE 7 (BONUS) — FILM TIME CAPSULE with localStorage
   ============================================================ */

const capsuleForm = document.getElementById('capsuleForm');
const capsuleGrid = document.getElementById('capsuleGrid');
const capsuleClear = document.getElementById('capsuleClear');

/**
 * Renders all saved capsules from localStorage into the grid.
 */
function renderCapsules() {
    const saved = JSON.parse(localStorage.getItem('filmCapsules') || '[]');

    // Keep the two static demo capsules (first two children) and remove dynamic ones
    const dynamicCapsules = capsuleGrid.querySelectorAll('.capsule-dynamic');
    dynamicCapsules.forEach(c => c.remove());

    // Render saved capsules in reverse order (newest first)
    [...saved].reverse().forEach(entry => {
        const article = document.createElement('article');
        article.className = 'capsule bg-dark text-white p-3 rounded-3 capsule-dynamic';
        article.innerHTML = `
            <h5>${escapeHTML(entry.title)}</h5>
            <small class="text-secondary">${escapeHTML(entry.year)}</small>
            <p class="mt-2 mb-0">${escapeHTML(entry.memory)}</p>
        `;
        // Insert after the static capsules
        capsuleGrid.appendChild(article);
    });
}

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Handle capsule form submission
if (capsuleForm) {
    capsuleForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const titleInput = document.getElementById('capsuleTitle');
        const yearInput = document.getElementById('capsuleYear');
        const memoryInput = document.getElementById('capsuleMemory');
        const capsuleMsg = document.getElementById('capsuleMsg');

        const title = titleInput.value.trim();
        const year = yearInput.value.trim();
        const memory = memoryInput.value.trim();

        // Basic validation
        if (!title || !year || !memory) {
            capsuleMsg.textContent = '⚠ Please fill in all fields.';
            capsuleMsg.style.color = '#ff6b6b';
            return;
        }

        // Save to localStorage
        const saved = JSON.parse(localStorage.getItem('filmCapsules') || '[]');
        saved.push({ title, year, memory });
        localStorage.setItem('filmCapsules', JSON.stringify(saved));

        // Success feedback
        capsuleMsg.textContent = '✅ Capsule saved!';
        capsuleMsg.style.color = '#2ecc71';

        // Clear form fields
        titleInput.value = '';
        yearInput.value = '';
        memoryInput.value = '';

        // Re-render the grid
        renderCapsules();

        // Clear success message after 3 seconds
        setTimeout(() => { capsuleMsg.textContent = ''; }, 3000);
    });
}

// Clear all saved capsules
if (capsuleClear) {
    capsuleClear.addEventListener('click', () => {
        localStorage.removeItem('filmCapsules');
        renderCapsules();
    });
}

// Load saved capsules on page start
renderCapsules();


/* ============================================================
   VISIT COUNTER — localStorage bonus
   ============================================================ */

let visits = parseInt(localStorage.getItem('visitCount') || '0', 10);
visits += 1;
localStorage.setItem('visitCount', visits);

const visitCounter = document.getElementById('visitCounter');
if (visitCounter) {
    visitCounter.textContent = `You have visited this page ${visits} time${visits !== 1 ? 's' : ''}.`;
}
