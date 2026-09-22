/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
    const scrollDown = window.scrollY

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        } else {
            sectionsClass.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
    // reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200}); 

/*===== DARK/LIGHT THEME TOGGLE =====*/
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const savedTheme = localStorage.getItem('theme');

    // Always set dark mode by default if no preference is saved
    if (!savedTheme || savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (themeToggle) themeToggle.checked = true;
        if (themeToggleMobile) themeToggleMobile.checked = true;
    }

    function setTheme(isDark) {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            setTheme(this.checked);
            if (themeToggleMobile) themeToggleMobile.checked = this.checked;
        });
    }

    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('change', function() {
            setTheme(this.checked);
            if (themeToggle) themeToggle.checked = this.checked;
        });
    }
});
/*==============================================================
    VIDEO CATEGORY FILTER
==============================================================*/

document.addEventListener('DOMContentLoaded', function () {

    const videoFilters = document.querySelectorAll('.video__filter');
    const videoItems = document.querySelectorAll('.video-item');

    videoFilters.forEach(filter => {

        filter.addEventListener('click', function () {

            // Remove active class from all buttons
            videoFilters.forEach(button => {
                button.classList.remove('active');
            });

            // Make clicked button active
            this.classList.add('active');

            // Get selected category
            const selectedCategory = this.getAttribute('data-filter');

            // Show / hide videos
            videoItems.forEach(item => {

                const category = item.getAttribute('data-category');
                const video = item.querySelector('video');

                if (
                    selectedCategory === 'all' ||
                    selectedCategory === category
                ) {

                    item.style.display = '';

                } else {

                    item.style.display = 'none';

                    // Stop hidden video
                    if (video) {
                        video.pause();
                    }

                }

            });

        });

    });

});


/*==============================================================
    VIDEO AUTOPLAY ON SCROLL
==============================================================*/

document.addEventListener('DOMContentLoaded', function () {

    const videos = document.querySelectorAll('.video-item video');

    videos.forEach(video => {

        // Required for mobile autoplay
        video.muted = true;
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');

        // Don't download the complete video immediately
        video.preload = 'metadata';

    });


    /*
     * Detect when videos enter the screen.
     */
    const videoObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                const video = entry.target;

                if (entry.isIntersecting) {

                    // Start muted autoplay
                    video.muted = true;

                    const playPromise = video.play();

                    if (playPromise !== undefined) {

                        playPromise.catch(() => {
                            // Browser may block autoplay.
                            // User can still press Play.
                        });

                    }

                } else {

                    // Pause when video leaves screen
                    video.pause();

                }

            });

        },
        {
            threshold: 0.55,
            rootMargin: '100px 0px 100px 0px'
        }
    );


    videos.forEach(video => {
        videoObserver.observe(video);
    });

});


/*==============================================================
    ONLY ONE VIDEO PLAYS AT A TIME
==============================================================*/

document.addEventListener('DOMContentLoaded', function () {

    const videos = document.querySelectorAll('.video-item video');

    videos.forEach(video => {

        video.addEventListener('play', function () {

            videos.forEach(otherVideo => {

                if (otherVideo !== video) {
                    otherVideo.pause();
                }

            });

        });

    });

});


/*==============================================================
    LOW NETWORK / DATA SAVER
==============================================================*/

document.addEventListener('DOMContentLoaded', function () {

    const videos = document.querySelectorAll('.video-item video');

    const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;


    /*
     * If the user has Data Saver enabled,
     * don't force autoplay.
     */
    if (connection && connection.saveData) {

        videos.forEach(video => {
            video.pause();
        });

    }


    /*
     * On 2G / slow-2G connections,
     * don't preload videos.
     */
    if (
        connection &&
        (
            connection.effectiveType === '2g' ||
            connection.effectiveType === 'slow-2g'
        )
    ) {

        videos.forEach(video => {
            video.preload = 'none';
        });

    }

});