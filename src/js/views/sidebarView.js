import View from "./view";
import previewView from "./previewView";

class SidebarView extends View {
  _parentElement = document.querySelector(".results");

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new SidebarView();
