import "core-js/stable";
import "regenerator-runtime/runtime";

import * as model from "./model";
import { MODAL_CLOSE_SEC } from "./config";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import sidebarView from "./views/sidebarView";
import paginationView from "./views/paginationView";
import bookmarksView from "./views/bookmarksView";
import addRecipeView from "./views/addRecipeView";

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    await model.fetchRecipes(id);

    bookmarksView.update(model.state.bookmarks);
    sidebarView.update(model.getSearchResultPage());
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
}

async function controlSearch() {
  try {
    sidebarView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) {
      sidebarView.renderError("Please enter a search query");
      return;
    }

    await model.loadSearchResults(query);
    searchView.clearInput(model.state.search.results.length);
    controlSearchResult();
  } catch (error) {
    console.error(error);
  }
}

function controlSearchResult(pageNumber) {
  try {
    sidebarView.render(model.getSearchResultPage(pageNumber));
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
}

function controlPagination(event) {
  try {
    const target = event.target.closest(".btn--inline");
    if (!target) return;

    const goToPage = +target.dataset.goTo;
    controlSearchResult(goToPage);
  } catch (error) {
    console.error(error);
  }
}

function controlServings(event) {
  const btn = event.target.closest(".btn--update-servings");
  if (!btn) return;
  const updateTo = Number(btn.dataset.updateTo);
  // console.log(btn);

  if (updateTo > 0) {
    model.updateServings(updateTo);
    recipeView.update(model.state.recipe);
  }
}

function controlAddBookmark(event) {
  const btn = event.target.closest(".btn--bookmark");
  if (!btn) return;
  const recipe = model.state.recipe;

  if (recipe.bookmarked) model.deleteBookMark(model.state.recipe.id);
  else model.addBookMark(model.state.recipe);

  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(event) {
  try {
    event.preventDefault();
    const dataArr = [...new FormData(this)];
    const data = Object.fromEntries(dataArr);
    addRecipeView.renderSpinner();
    await model.uploadRecipe(data);

    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);
    addRecipeView.renderMessage();
    setTimeout(() => addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000);

    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    //
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
}

function init() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerRender(controlSearch);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();
