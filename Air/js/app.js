(() => {
    "use strict";
    const modules_flsModules = {};
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
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                const headerElement = document.querySelector(headerItem);
                if (!headerElement.classList.contains("_header-scroll")) {
                    headerElement.style.cssText = `transition-duration: 0s;`;
                    headerElement.classList.add("_header-scroll");
                    headerItemHeight = headerElement.offsetHeight;
                    headerElement.classList.remove("_header-scroll");
                    setTimeout((() => {
                        headerElement.style.cssText = ``;
                    }), 0);
                } else headerItemHeight = headerElement.offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if (typeof SmoothScroll !== "undefined") (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            functions_FLS(`[gotoBlock]: Юхуу...їдемо до ${targetBlock}`);
        } else functions_FLS(`[gotoBlock]: Йой... Такого блоку немає на сторінці: ${targetBlock}`);
    };
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                this.scrollWatcherLogging(`Прокинувся, стежу за об'єктами (${items.length})...`);
                let uniqParams = uniqArray(Array.from(items).map((function(item) {
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                })));
                uniqParams.forEach((uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter((function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    }));
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                }));
            } else this.scrollWatcherLogging("Сплю, немає об'єктів для стеження. ZzzZZzz");
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if (paramsWatch.root !== "null") this.scrollWatcherLogging(`Эмм... батьківського об'єкта ${paramsWatch.root} немає на сторінці`);
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
                this.scrollWatcherLogging(`йой, налаштування data-watch-margin потрібно задавати в PX або %`);
                return;
            }
            if (paramsWatch.threshold === "prx") {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            this.observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    this.scrollWatcherCallback(entry, observer);
                }));
            }), configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach((item => this.observer.observe(item)));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) {
                !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
                this.scrollWatcherLogging(`Я бачу ${targetElement.classList}, додав клас _watcher-view`);
            } else {
                targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
                this.scrollWatcherLogging(`Я не бачу ${targetElement.classList}, прибрав клас _watcher-view`);
            }
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
            this.scrollWatcherLogging(`Я перестав стежити за ${targetElement.classList}`);
        }
        scrollWatcherLogging(message) {
            this.config.logging ? functions_FLS(`[Спостерігач]: ${message}`) : null;
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
        }
    }
    modules_flsModules.watcher = new ScrollWatcher({});
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if (e.type === "click") {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    if (modules_flsModules.fullpage) {
                        const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fp-section]");
                        const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;
                        if (fullpageSectionId !== null) {
                            modules_flsModules.fullpage.switchingSection(fullpageSectionId);
                            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
                        }
                    } else gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if (e.type === "watcherCallback" && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if (targetElement.dataset.watch === "navigator") {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
    function headerScroll() {
        addWindowScrollEvent = true;
        const header = document.querySelector("header.header");
        const headerShow = header.hasAttribute("data-scroll-show");
        const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        let scrollDirection = 0;
        let timer;
        document.addEventListener("windowScroll", (function(e) {
            const scrollTop = window.scrollY;
            clearTimeout(timer);
            if (scrollTop >= startPoint) {
                !header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
                if (headerShow) {
                    if (scrollTop > scrollDirection) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null; else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    timer = setTimeout((() => {
                        !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    }), headerShowTimer);
                }
            } else {
                header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
                if (headerShow) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
            }
            scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
        }));
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const cityMap = {
        1: {
            name: "Los Angeles Intl Arpt, Los Angeles",
            abr: "lax",
            id: 1
        },
        2: {
            name: "Miami Intl, Miami",
            abr: "mia",
            id: 2
        },
        3: {
            name: "New York City",
            abr: "nyc",
            id: 3
        },
        4: {
            name: "Chicago",
            abr: "chi",
            id: 4
        },
        5: {
            name: "San Francisco",
            abr: "sfo",
            id: 5
        },
        6: {
            name: "Seattle",
            abr: "sea",
            id: 6
        },
        7: {
            name: "Boston",
            abr: "bos",
            id: 7
        },
        8: {
            name: "Las Vegas",
            abr: "las",
            id: 8
        },
        9: {
            name: "Washington D.C.",
            abr: "wdc",
            id: 9
        },
        10: {
            name: "Atlanta",
            abr: "atl",
            id: 10
        },
        11: {
            name: "Dallas",
            abr: "dal",
            id: 11
        },
        12: {
            name: "Houston",
            abr: "hou",
            id: 12
        },
        13: {
            name: "Philadelphia",
            abr: "phl",
            id: 13
        },
        14: {
            name: "Phoenix",
            abr: "phx",
            id: 14
        },
        15: {
            name: "Denver",
            abr: "den",
            id: 15
        },
        16: {
            name: "Orlando",
            abr: "orl",
            id: 16
        },
        17: {
            name: "San Diego",
            abr: "sdc",
            id: 17
        },
        18: {
            name: "Minneapolis",
            abr: "msp",
            id: 18
        },
        19: {
            name: "Detroit",
            abr: "det",
            id: 19
        },
        20: {
            name: "Tampa",
            abr: "tpa",
            id: 20
        },
        21: {
            name: "St. Louis",
            abr: "stl",
            id: 21
        },
        22: {
            name: "Charlotte",
            abr: "cha",
            id: 22
        },
        23: {
            name: "Portland",
            abr: "por",
            id: 23
        },
        24: {
            name: "Salt Lake City",
            abr: "slc",
            id: 24
        },
        25: {
            name: "Austin",
            abr: "aus",
            id: 25
        }
    };
    const cityForms = document.querySelectorAll(".item-city-form");
    const inputs = [];
    const lists = [];
    const fullNames = [];
    cityForms.forEach(((cityForm, index) => {
        const input = cityForm.querySelector("input");
        const list = cityForm.querySelector(".item-city-form__list");
        const fullName = cityForm.querySelector(".item-city-form__full-name");
        inputs.push(input);
        lists.push(list);
        fullNames.push(fullName);
        input.addEventListener("input", (event => handleInput(event, index)));
        input.addEventListener("focus", (() => updateListVisibility(list, input)));
        input.addEventListener("blur", (() => updateListVisibility(list, input)));
    }));
    const switchButton = document.querySelector(".inputs-form__switch");
    switchButton.addEventListener("click", switchCities);
    function createCityItem(city, input, fullNameElement, list) {
        const cityItem = document.createElement("button");
        cityItem.classList.add("city-item");
        cityItem.textContent = city.name;
        cityItem.addEventListener("click", (() => handleCityItemClick(city, input, fullNameElement, list)));
        return cityItem;
    }
    function handleInput(event, inputIndex) {
        const inputValue = event.target.value.toLowerCase();
        const list = lists[inputIndex];
        list.innerHTML = "";
        if (inputValue.length === 0) return;
        const selectedCities = new Set;
        for (let i = 0; i < inputs.length; i++) if (i !== inputIndex && inputs[i].value.trim().length > 0) selectedCities.add(inputs[i].value.trim().toLowerCase());
        for (const key in cityMap) {
            const city = cityMap[key];
            const cityAbr = city.abr.toLowerCase();
            if ((city.name.toLowerCase().includes(inputValue) || cityAbr.includes(inputValue)) && !selectedCities.has(cityAbr)) {
                const cityItem = createCityItem(city, inputs[inputIndex], fullNames[inputIndex], list);
                list.appendChild(cityItem);
            }
        }
        updateListVisibility(list, inputs[inputIndex]);
    }
    function handleCityItemClick(city, input, fullNameElement, list) {
        input.value = city.abr;
        fullNameElement.textContent = city.name;
        input.focus();
        list.innerHTML = "";
        updateListVisibility(list, input);
    }
    function switchCities() {
        const tempValue = inputs[0].value;
        const tempFullName = fullNames[0].textContent;
        inputs[0].value = inputs[1].value;
        inputs[1].value = tempValue;
        fullNames[0].textContent = fullNames[1].textContent;
        fullNames[1].textContent = tempFullName;
        lists.forEach((list => list.innerHTML = ""));
        lists.forEach(((list, index) => updateListVisibility(list, inputs[index])));
    }
    function updateListVisibility(list, input) {
        const cityItems = list.querySelectorAll(".city-item");
        if (cityItems.length > 0 && input.value.trim().length > 0) list.classList.add("active"); else list.classList.remove("active");
    }
    const dateFormSides = document.querySelectorAll(".item-date-form__side");
    function checkAndSetDisabledClass() {
        dateFormSides.forEach((side => {
            const input = side.querySelector('input[type="date"]');
            const prevButton = side.querySelector(".item-date-form__prev");
            const nextButton = side.querySelector(".item-date-form__next");
            if (input.value === "") {
                prevButton.classList.add("disabled");
                nextButton.classList.add("disabled");
            } else {
                prevButton.classList.remove("disabled");
                nextButton.classList.remove("disabled");
            }
        }));
    }
    document.addEventListener("DOMContentLoaded", checkAndSetDisabledClass);
    dateFormSides.forEach((side => {
        const input = side.querySelector('input[type="date"]');
        input.addEventListener("change", checkAndSetDisabledClass);
        const prevButton = side.querySelector(".item-date-form__prev");
        const nextButton = side.querySelector(".item-date-form__next");
        prevButton.addEventListener("click", (() => {
            adjustDate(side, -1);
        }));
        nextButton.addEventListener("click", (() => {
            adjustDate(side, 1);
        }));
    }));
    function adjustDate(side, amount) {
        const input = side.querySelector('input[type="date"]');
        const currentDate = new Date(input.value);
        const adjustedDate = new Date(currentDate);
        adjustedDate.setDate(currentDate.getDate() + amount);
        input.value = adjustedDate.toISOString().slice(0, 10);
        checkAndSetDisabledClass();
    }
    document.querySelectorAll("[data-char]").forEach((textBlock => {
        const dataChar = textBlock.hasAttribute("data-char");
        const dataLa = textBlock.hasAttribute("data-la");
        let delayIncrement = 0;
        if (dataChar) {
            const content = textBlock.textContent;
            textBlock.innerHTML = "";
            content.split("").forEach(((char, i) => {
                const span = document.createElement("span");
                span.textContent = char;
                if (char === " ") {
                    const space = document.createTextNode(" ");
                    textBlock.appendChild(space);
                } else textBlock.appendChild(span);
                if (dataLa) {
                    delayIncrement = parseInt(textBlock.getAttribute("data-la")) || 0;
                    const delay = delayIncrement + i * 50;
                    span.style.transitionProperty = "transform, opacity";
                    span.style.transitionDelay = delay + "ms";
                }
            }));
        }
    }));
    window["FLS"] = true;
    isWebp();
    menuInit();
    pageNavigation();
    headerScroll();
})();