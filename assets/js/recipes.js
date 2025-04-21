"use strict";

/** Import */
import { fetchData } from "./api.js";
import { $skeletonCard, cardQueries } from "./global.js";
import { getTime } from "./module.js";

/** Accordion */
const $accordions = document.querySelectorAll("[data-accordion]");

const initAccordion = ($element) => {
    const $button = $element.querySelector("[data-accordion-btn]");
    let isExpanded = false;

    $button.addEventListener("click", () => {
        isExpanded = !isExpanded;
        $button.setAttribute("aria-expanded", isExpanded);
    });
};

for (const $accordion of $accordions) {
    initAccordion($accordion);
}

/** Filter bar toggle for mobile screen */
const $filterBar = document.querySelector("[data-filter-bar]");
const $filterBarToggle = document.querySelectorAll("[data-filter-toggle]");

const $overlay = document.querySelector("[data-overlay]");

window.addEventOnElements($filterBarToggle, "click", () => {
    $filterBar.classList.toggle("active");
    $overlay.classList.toggle("active");
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = bodyOverflow === "hidden" ? "visible" : "hidden";
});

/** Filter submit and clear */
const $filterSubmit = document.querySelector("[data-filter-submit]");
const $filterClear = document.querySelector("[data-filter-clear]");
const $filterSearch = $filterBar.querySelector("input[type='search']");

$filterSubmit.addEventListener("click", () => {
    const $filterCheckboxes = $filterBar.querySelectorAll("input:checked");

    const queries = [];

    if ($filterSearch.value) {
        queries.push(["q", $filterSearch.value]);
    }

    if ($filterCheckboxes.length) {
        for (const $checkbox of $filterCheckboxes) {
            const key = $checkbox.parentElement.parentElement.dataset.filterKey;
            queries.push([key, $checkbox.value]);
        }
    }

    window.location = queries.length
        ? `?${queries.join("&").replace(/,/g, "=")}`
        : "/recipes.html";
});

$filterSearch.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        $filterSubmit.click();
    }
});

$filterClear.addEventListener("click", () => {
    const $filterCheckboxes = $filterBar.querySelectorAll("input:checked");

    $filterCheckboxes?.forEach(($checkbox) => {
        $checkbox.checked = false;
    });

    $filterSearch.value &&= "";
});

const queryStr = window.location.search.substring(1);
const queries = queryStr && queryStr.split("&").map((i) => i.split("="));

const $filterCount = document.querySelector("[data-filter-count]");

if (queries.length) {
    $filterCount.style.display = "block";
    $filterCount.innerText = queries.length;
} else {
    $filterCount.style.display = "none";
}

queryStr &&
    queryStr.split("&").forEach((i) => {
        if (i.split("=")[0] === "q") {
            const searchInput = $filterBar.querySelector("input[type='search']");
            if (searchInput) {
                searchInput.value = i.split("=")[1].replace(/%20/g, " ");
            }
        } else {
            const checkbox = $filterBar.querySelector(`input[value='${i.split("=")[1]}']`);
            if (checkbox) {
                checkbox.checked = true;
            }
        }
    });

const $filterBtn = document.querySelector("[data-filter-btn]");

window.addEventListener("scroll", () => {
    $filterBtn.classList[window.scrollY >= 120 ? "add" : "remove"]("active");
});

/* 
    Request recipes and render
*/

const /* {NodeElement} */ $gridList = document.querySelector("[data-grid-list]");
const /* {NodeElement} */ $loadMore = document.querySelector("[data-load-more]");
const /* {Array}  */ defaultQueries = [
    ["mealType", "teatime"],
    ["mealType", "snack"],
    ["mealType", "dinner"],
    ["mealType", "lunch"],
    ["mealType", "breakfast"],
    ...cardQueries,
];

$gridList.innerHTML = $skeletonCard.repeat(20);
let /* {String} */ nextPageUrl = "";

const renderRecipe = (data) => {
    data.hits.map((item, index) => {
        const {
            recipe: { image, label: title, totalTime: cookingTime, uri },
        } = item;

        const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
        // console.log(recipeId)
        const isSaved = window.localStorage.getItem(`cookio-recipe${recipeId}`);
        const $card = document.createElement("div");
        $card.classList.add("card");
        $card.style.animationDelay = `${100 * index}ms`;

        $card.innerHTML = `<figure class="card-media img-holder">
            <img src="${image}" width="200" height="200" loading="lazy" alt="${title}" class="img-cover" >

            </figure>
            <div class="card-body">
                <h3 class="title-small">
                    <a href="./detail.html?id=recipe_${recipeId}" class="card-link">${title}</a>
                </h3>
                <div class="meta-wrapper">
                    <div class="meta-item">
                        <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                        <span class="label-medium">${getTime(cookingTime).time || "<1"
            } ${getTime(cookingTime).timeUnit}</span>
                    </div>
                    <button class="icon-btn has-state ${isSaved ? "saved" : "removed"
            }" aria-label="Add to saved recipes" onclick="saveRecipe(this,'${recipeId}')">
                        <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
                        <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
                    </button>
                </div>
            </div>`;
        $gridList.appendChild($card);
    });
};

let /** {Boolean} */ requestBefore = true;

fetchData(queries || defaultQueries, (data) => {
    const next = data._link?.next; // Safely access 'next'
    nextPageUrl = next?.href || ""; // Default to an empty string if 'next' is undefined

    $gridList.innerHTML = "";
    requestBefore = false;

    if (data.hits.length) {
        renderRecipe(data);
    } else {
        $loadMore.innerHTML = `<p class="body-medium info-text">No recipe found</p>`;
    }
});

const CONTAINER_MAX_WIDTH = 1200;
const CONTAINER_MAX_CARD = 6;

window.addEventListener("scroll", async () => {
    if ($loadMore.getBoundingClientRect().top < window.innerHeight) {
        if (nextPageUrl && !requestBefore) {
            $loadMore.innerHTML = $skeletonCard.repeat(
                Math.round(($loadMore.clientWidth / CONTAINER_MAX_WIDTH) * CONTAINER_MAX_CARD)
            );
            requestBefore = true;

            const response = await fetch(nextPageUrl);
            const data = await response.json();

            const { _links: { next } } = data;
            nextPageUrl = next?.href;

            renderRecipe(data);
            $loadMore.innerHTML = "";
            requestBefore = false;
        } else {
            $loadMore.innerHTML = `<p class="body-medium info-text">No more recipe found</p>`;
        }
    }
});
