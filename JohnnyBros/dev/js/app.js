'use strict';

(function() {
    document.querySelector('.menu-toggle').addEventListener('click', toggleMenu, false);

    function toggleMenu() {
        event.target.classList.toggle('is-open');
    }

    window.addEventListener('scroll', scroller, false);
    window.addEventListener('touchmove', scroller, false);

    function scroller () {
        var curent_pos = window.pageYOffset;
        var height = document.querySelector('.header').offsetHeight;
        var sections = document.querySelectorAll('.section');

        if (curent_pos >= height) {
            document.querySelector('.navbar').classList.add('fixed');
        } else {
            document.querySelector('.navbar').classList.remove('fixed');
        }

        sections.forEach(function(el) {
            var top = el.offsetTop - (.25 * window.innerHeight);
            var bottom = top + el.offsetHeight;

            if (curent_pos >= top && curent_pos <= bottom) {
                document.querySelectorAll('.nav-link').forEach(function(link) {
                    link.classList.remove('active');
                });

                var hash = '#' + el.getAttribute('id');
                if(window.location.hash !== hash) {
                    history.pushState(null, null, hash);
                }

                document.querySelector('a[href="' + hash + '"]').classList.add('active');
            }
        });
    }
})();