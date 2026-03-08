document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Animations via Intersection Observer ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once visible if we don't want repeat animations
                // observer.unobserve(entry.target);
            } else {
                // Remove to allow re-animating when scrolling back up (optional, but fun)
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.screen');
    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Background Music Control ---
    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    const musicIcon = musicBtn.querySelector('i');
    let isPlaying = false;

    // Set lower volume
    bgMusic.volume = 0.4;

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicIcon.classList.remove('fa-pause');
            musicIcon.classList.add('fa-play');
        } else {
            bgMusic.play().catch(e => console.log("Audio play failed:", e));
            musicIcon.classList.remove('fa-play');
            musicIcon.classList.add('fa-pause');
        }
        isPlaying = !isPlaying;
    });

    // --- Falling Flowers Animation ---
    const flowerContainer = document.getElementById('flower-container');
    const colors = ['#ff4d85', '#ffb6c1', '#f06292', '#ba68c8', '#e1bee7'];

    function createFlower() {
        const flower = document.createElement('div');
        flower.classList.add('flower');

        // SVG Petal for realistic feel
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.style.width = '100%';
        svg.style.height = '100%';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        // A realistic curved petal shape
        path.setAttribute('d', 'M50,0 C70,20 80,50 50,100 C20,50 30,20 50,0 Z');
        path.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
        path.setAttribute('opacity', (Math.random() * 0.2 + 0.1).toString()); // Lower opacity for background

        svg.appendChild(path);
        flower.appendChild(svg);

        // Random properties
        const startPos = Math.random() * 100; // 0 to 100 vw
        const duration = Math.random() * 6 + 8; // 8s to 14s (slower)
        const delay = Math.random() * 3;
        const size = Math.random() * 0.8 + 0.4; // 0.4rem to 1.2rem (smaller)

        flower.style.left = startPos + 'vw';
        flower.style.animationDuration = duration + 's';
        flower.style.animationDelay = delay + 's';
        flower.style.width = size + 'rem';
        flower.style.height = size + 'rem';

        // Clean up after animation
        flower.addEventListener('animationend', () => {
            flower.remove();
        });

        flowerContainer.appendChild(flower);
    }

    // Create flowers periodically (less frequent)
    setInterval(createFlower, 1500);

    // Initial burst (fewer)
    for (let i = 0; i < 8; i++) {
        setTimeout(createFlower, Math.random() * 2000);
    }

    // --- Share Mechanisms ---
    const shareBtn = document.getElementById('share-btn');
    const copyBtn = document.getElementById('copy-btn');
    const toast = document.getElementById('toast');

    function showToast(message) {
        toast.innerText = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // WhatsApp Share
    shareBtn.addEventListener('click', () => {
        const title = "Happy Women's Day! 🌸";
        const url = window.location.href;
        const text = `Hey! I saw this hilarious and sweet Women's Day page and thought of you: ${url}`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    });

    // Native Share / Copy Link
    copyBtn.addEventListener('click', async () => {
        const shareData = {
            title: "Happy Women's Day! 🌸",
            text: "You have to see this funny Women's Day page!",
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
            // Fallback
            await navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard!');
        }
    });
});
