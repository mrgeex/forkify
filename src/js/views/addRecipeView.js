import View from "./view";
import icons from "url:../../img/icons.svg";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _overlay = document.querySelector(".overlay");
  _window = document.querySelector(".add-recipe-window");
  _openBtn = document.querySelector(".nav__btn--add-recipe");
  _closeBtn = document.querySelector(".btn--close-modal");
  _message = "Recipe was uploaded successfully.";

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
    this._window.classList.contains("hidden") &&
      setTimeout(() => {
        this.render("this._data");
      }, 1000);
  }

  _addHandlerShowWindow() {
    this._openBtn.addEventListener("click", this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._closeBtn.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", handler);
  }

  _generateMarkup() {
    return `
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label for="title">Title</label>
          <input value="TEST23" required name="title" id="title" type="text" />
          <label for="sourceUrl">URL</label>
          <input value="TEST23" required name="sourceUrl" id="sourceUrl" type="text" />
          <label for="image">Image URL</label>
          <input value="TEST23" required name="image" id="image" type="text" />
          <label for="publisher">Publisher</label>
          <input value="TEST23" required name="publisher" id="publisher" type="text" />
          <label for="cookingTime">Prep time</label>
          <input value="23" required name="cookingTime" id="cookingTime" type="number" />
          <label for="servings">Servings</label>
          <input value="4" required name="servings" id="servings" type="number" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label for="ingredient-1">Ingredient 1</label>
          <input
            value="0.5,kg,Rice"
            type="text"
            required
            name="ingredient-1"
            id="ingredient-1"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label for="ingredient-2">Ingredient 2</label>
          <input
            value="1,,Avocado"
            type="text"
            name="ingredient-2"
            id="ingredient-2"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label for="ingredient-3">Ingredient 3</label>
          <input
            value=",,salt"
            type="text"
            name="ingredient-3"
            id="ingredient-3"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label for="ingredient-4">Ingredient 4</label>
          <input
            type="text"
            name="ingredient-4"
            id="ingredient-4"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label for="ingredient-5">Ingredient 5</label>
          <input
            type="text"
            name="ingredient-5"
            id="ingredient-5"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label for="ingredient-6">Ingredient 6</label>
          <input
            type="text"
            name="ingredient-6"
            id="ingredient-6"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="${icons}#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>`;
  }
}

export default new AddRecipeView();
