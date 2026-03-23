import icons from "url:../../img/icons.svg";

export default class View {
  _data;
  _errorMessage = "No recipes found for your query. Please try again!";
  _message;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data to be rendered
   * @param {boolean} [render=true] if false create markup string instead of rendering to the DOM
   * @return {undefined | string} Markup string is returned if render=false
   * @this {Object} View instance
   * @author Mr. Geex
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll("*"));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll("*"),
    );

    newElements.forEach((newElement, index) => {
      let curEL = currentElements[index];
      // update text
      if (
        !newElement.isEqualNode(curEL) &&
        newElement.firstChild?.nodeValue.trim() !== ""
      )
        curEL.textContent = newElement.textContent;

      // update attributes
      if (!newElement.isEqualNode(curEL))
        Array.from(newElement.attributes).forEach((attribute) => {
          curEL.setAttribute(attribute.name, attribute.value);
        });
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((event) => {
      window.addEventListener(event, handler);
    });
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
