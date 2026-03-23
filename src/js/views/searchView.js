class SearchView {
  _parentElement = document.querySelector(".search");

  getQuery() {
    return this._parentElement.querySelector(".search__field").value.trim();
  }

  clearInput(data) {
    if (data) document.querySelector(".search__field").value = "";
  }

  addHandlerRender(handler) {
    this._parentElement.addEventListener("submit", (event) => {
      event.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
