import { API_KEY, API_URL } from "./config";
import { RES_PER_PAGE } from "./config";
import { AJAX } from "./helper";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

function createRecipeObject(data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
}

export async function fetchRecipes(id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    console.log(API_KEY)

    // console.log(res, data);
    state.recipe = createRecipeObject(data);
    // console.log(state.recipe);
    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
  } catch (error) {
    console.error(`whoops! ${error} `);
    throw error;
  }
}

export async function loadSearchResults(query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    // console.log(data);
    state.search.query = query;
    state.search.results = data.data.recipes.map((record) => {
      return {
        id: record.id,
        title: record.title,
        publisher: record.publisher,
        image: record.image_url,
        ...(record.key && { key: record.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    console.error(`whoops! ${error} `);
    throw error;
  }
}

export function getSearchResultPage(page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE;

  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach((ingredient) => {
    // console.log(ingredient, ingredient.quantity);
    ingredient.quantity = (
      (ingredient.quantity * newServings) /
      state.recipe.servings
    ).toFixed(2);
  });
  state.recipe.servings = newServings;
}

function persistBookmarks() {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

export function addBookMark(recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
}

export function deleteBookMark(id) {
  const index = state.bookmarks.findIndex((element) => element.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
}

export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((item) => item[0].startsWith("ingredient") && item[1] !== "")
      .map((ingredient) => {
        const ingArr = ingredient[1].split(",").map((item) => item.trim());
        if (ingArr.length < 3)
          throw new Error(
            `Value Invalid: Please follow the ingredient format!`,
          );

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      id: newRecipe.id,
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      servings: +newRecipe.servings,
      ingredients: ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
    //
  } catch (error) {
    throw error;
  }
}

// For Debugging
function clearStorage() {
  localStorage.removeItem("bookmarks");
}
// clearStorage();

function init() {
  const storage = JSON.parse(localStorage.getItem("bookmarks"));
  if (storage) state.bookmarks = storage;
}
init();
