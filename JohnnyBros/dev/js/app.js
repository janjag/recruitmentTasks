'use strict';

(function(doc, win) {
    var EV_NAME_CLICK = 'click';
    var EV_NAME_SCROLL = 'scroll';
    var EV_NAME_TOUCHMOVE = 'touchmove';
    var EV_NAME_KEYUP = 'keyup';

    var EL_NAME_MENUTOGGLE = '.menu-toggle';
    var EL_NAME_NAVBAR = '.navbar';
    var EL_NAME_NAVLIK = '.nav-link';
    var EL_NAME_HEADER = '.header';
    var EL_NAME_SECTION = '.section';
    var EL_NAME_JSSCROLL = '.js-scroll';
    var EL_NAME_INPUT = '.input';
    var EL_NAME_TEXTAREA = '.textarea';

    var EL_ATTR_ID = 'id';
    var EL_ATTR_HREF = 'href';

    var CLNAME_IS_OPEN = 'is-open';
    var CLNAME_ACTIVE = 'active';
    var CLNAME_FIXED = 'fixed';
    var CLNAME_JS_TOUCHED = 'js-touched';
    var CLNAME_ERROR = 'error';
    var CLNAME_SUCCESS = 'success';

    var PARAM_NAME_EASE = 'easeOutQuad';

    function selectElem(el) {
        return doc.querySelector(el);
    }

    function selectAllElem(el) {
        return doc.querySelectorAll(el);
    }

    selectElem(EL_NAME_MENUTOGGLE).addEventListener(EV_NAME_CLICK, function(ev) {
        toggleMenu(ev);
    }, false);

    function toggleMenu(ev) {
        ev.target.classList.toggle(CLNAME_IS_OPEN);
    }

    win.addEventListener(EV_NAME_SCROLL, scroller, false);
    win.addEventListener(EV_NAME_TOUCHMOVE, scroller, false);

    function clearAciveLink() {
        selectAllElem(EL_NAME_NAVLIK).forEach(function(link) {
            link.classList.remove(CLNAME_ACTIVE);
        });
    }

    function scroller () {
        var curent_pos = win.pageYOffset;
        var header_height = selectElem(EL_NAME_HEADER).offsetHeight;
        var sections = selectAllElem(EL_NAME_SECTION);

        if (curent_pos >= header_height) {
            selectElem(EL_NAME_NAVBAR).classList.add(CLNAME_FIXED);
        } else {
            clearAciveLink();
            selectElem(EL_NAME_NAVBAR).classList.remove(CLNAME_FIXED);
        }

        sections.forEach(function(el) {
            var top = el.offsetTop - (.25 * win.innerHeight);
            var bottom = top + el.offsetHeight;
            var hash;
            
            if (curent_pos >= top && curent_pos <= bottom) {
                clearAciveLink();

                hash = '#' + el.getAttribute(EL_ATTR_ID);
                if (win.location.hash !== hash) {
                    history.pushState(null, null, hash);
                }

                selectElem('a[href="#' + el.getAttribute(EL_ATTR_ID) + '"]').classList.add(CLNAME_ACTIVE);
            } 
        });
    }

    // Scroll to section
    doc.addEventListener(EV_NAME_CLICK, function(ev) {
        if (ev.target.matches(EL_NAME_JSSCROLL)) {
            var href = ev.target.getAttribute(EL_ATTR_HREF);
            scrollIt(selectElem(href), 300, PARAM_NAME_EASE);
            selectElem(EL_NAME_MENUTOGGLE).classList.remove(CLNAME_IS_OPEN);
        }
    });


    // simple form validation
    function checkValueLength(el) {
        console.log(el.value);
        el.classList.add(CLNAME_JS_TOUCHED);
        if (el.value.length < 2) {
            el.classList.remove(CLNAME_SUCCESS);
            el.classList.add(CLNAME_ERROR);
        } else {
            el.classList.remove(CLNAME_ERROR);
            el.classList.add(CLNAME_SUCCESS);
        }
    }

    selectAllElem(EL_NAME_INPUT).forEach(function(input) {
        input.addEventListener(EV_NAME_KEYUP, function(ev) {
            checkValueLength(ev.target);
        });
    });

    selectElem(EL_NAME_TEXTAREA).addEventListener(EV_NAME_KEYUP, function(ev) {
        checkValueLength(ev.target);
    });

})(document, window);