"use strict";

/**
 * Import
 */
import { getTime } from "./module.js";

const savedRecipes = Object.keys(window.localStorage).filter((item) => {
    return item.startsWith("cookio-recipe");
});

console.log(savedRecipes);

const $savedRecipeContainer = document.querySelector("[data-saved-recipe-container]");

$savedRecipeContainer.innerHTML = '<h2 class="headline-small section-title">All Saved Recipes</h2>';

const $gridList = document.createElement("div");
$gridList.classList.add("grid-list");

if (savedRecipes.length) {
    savedRecipes.map((savedRecipes, index) => {
        const {
            recipe: { image, label: title, totalTime: cookingTime, uri },
        } = JSON.parse(window.localStorage.getItem(savedRecipes));

        // console.log(JSON.parse(window.localStorage.getItem(savedRecipes)));
        const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
        console.log(recipeId);
        const isSaved = window.localStorage.getItem(`cookio-recipe${recipeId}`);
        const $card = document.createElement("div");
        // console.log($card)
        // console.log($girdList)
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
} else {
    $savedRecipeContainer.innerHTML += `<p class="body-large">You don't saved any recipes yet!</p>`;
}

$savedRecipeContainer.appendChild($gridList);
