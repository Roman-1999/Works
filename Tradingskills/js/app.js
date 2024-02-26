(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const mediaQuery = window.matchMedia("(min-width: 767.98px)");
    const handleResize = gridItem => {
        const itemServices = gridItem.querySelectorAll(".item-info");
        if (mediaQuery.matches) {
            if (itemServices.length % 2 !== 0) itemServices[itemServices.length - 1].classList.add("_full");
        } else {
            const fullItemServices = gridItem.querySelectorAll(".item-info._full");
            if (fullItemServices.length > 0) fullItemServices[fullItemServices.length - 1].classList.remove("_full");
        }
    };
    const gridItems = document.querySelectorAll(".grid-items");
    gridItems.forEach((gridItem => {
        const handleResizeDebounced = debounce((() => handleResize(gridItem)), 100);
        window.addEventListener("resize", handleResizeDebounced);
        handleResizeDebounced();
    }));
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    const toRem = value => value / 16 + "rem";
    const infoBlocks = document.querySelectorAll(".info-block");
    infoBlocks.forEach(((infoBlock, index) => {
        const imageBlock = infoBlock.querySelector(".info-block__image-block");
        const img = imageBlock.querySelector(".rectangle");
        const contentBlock = infoBlock.querySelector(".info-block__content");
        if (index % 2 === 0) {
            imageBlock.style.order = 1;
            contentBlock.style.order = 2;
            contentBlock.style.paddingRight = toRem(40);
            img.style.bottom = toRem(-1);
            img.style.left = toRem(-1);
            img.style.transform = "rotate(90deg)";
            img.style.position = "absolute";
            const mediaQuery = window.matchMedia("(max-width: 991.98px)");
            if (mediaQuery.matches) {
                img.style.transform = "rotate(180deg)";
                img.style.top = toRem(-1);
                contentBlock.style.paddingRight = toRem(0);
            }
            mediaQuery.addListener((event => {
                if (event.matches) {
                    img.style.transform = "rotate(180deg)";
                    img.style.top = toRem(-1);
                    contentBlock.style.paddingRight = toRem(0);
                } else {
                    imageBlock.style.order = 1;
                    contentBlock.style.order = 2;
                    contentBlock.style.paddingRight = toRem(40);
                    img.style.transform = "rotate(90deg)";
                    img.style.left = toRem(-1);
                    img.style.top = "auto";
                }
            }));
        } else {
            imageBlock.style.order = 2;
            contentBlock.style.order = 1;
            contentBlock.style.paddingLeft = toRem(40);
            img.style.bottom = toRem(-1);
            img.style.right = toRem(-1);
            img.style.position = "absolute";
            const mediaQuery = window.matchMedia("(max-width: 991.98px)");
            if (mediaQuery.matches) {
                imageBlock.style.order = 1;
                contentBlock.style.order = 2;
                img.style.transform = "rotate(-90deg)";
                img.style.top = toRem(-1);
                contentBlock.style.paddingLeft = toRem(0);
            }
            mediaQuery.addListener((event => {
                if (event.matches) {
                    imageBlock.style.order = 1;
                    contentBlock.style.order = 2;
                    img.style.transform = "rotate(-90deg)";
                    img.style.top = toRem(-1);
                    contentBlock.style.paddingLeft = toRem(0);
                } else {
                    imageBlock.style.order = 2;
                    contentBlock.style.order = 1;
                    contentBlock.style.paddingLeft = toRem(40);
                    img.style.transform = "rotate(0deg)";
                    img.style.right = toRem(-1);
                    img.style.top = "auto";
                }
            }));
        }
    }));
    window["FLS"] = true;
    isWebp();
})();