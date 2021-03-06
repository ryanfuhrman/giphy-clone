// 1. displays trending gifs on app load shown in a column/grid
// 2. has an input which allows you to search for specific gifs
// 3. at the bottom of the results, there is a ‘load more’ button, which gets more gifs using that search term.

const gifsContainer = document.querySelector(".gifs-container");
const categoriesContainer = document.querySelector(".categories-container");
const gifsList = document.querySelector(".gifs-list");
const categoriesList = document.querySelector(".categories-list");
const gifsTitle = document.querySelector(".gifs-title");
const trendingButton = document.querySelector(".trending-button");
const searchField = document.querySelector(".search-bar-input");
const searchButton = document.querySelector(".search-bar-button");
const loadMoreButton = document.querySelector(".load-more-button");
const navCategoryButtons = document.querySelectorAll(".nav-category-buttons");
const categoriesButton = document.querySelector(".categories-button");
const limit = 20;
let offset = 0;
let lastSearch = "";
let categoriesListItem;

const view = {
  populateTrending: function (data) {
    offset = 0;
    categoriesContainer.style.display = "none";
    gifsContainer.style.display = "block";
    gifsList.innerHTML = "";
    gifsTitle.innerHTML = "Trending GIFs";
    // downsized_medium.url
    data.data.map((gif) => {
      return (gifsList.innerHTML += `
        <li class="gifs-li" id="${gif.id}">
          <img  class="gifs-img" src="${gif.images.original_still.url}" alt="${gif.title}"></img>
        </li>
      `);
    });
  },
  populateGifs: function (data, searchQuery, clearResults) {
    searchField.value = "";
    categoriesContainer.style.display = "none";
    gifsContainer.style.display = "block";
    if (clearResults) {
      gifsList.innerHTML = "";
      offset = 0;
    }
    loadMoreButton.style.display = "block";
    gifsTitle.innerHTML = `Results for "${searchQuery}"`;
    data.data.map((gif) => {
      return (gifsList.innerHTML += `
        <li class="gifs-li" id="${gif.id}">
          <img class="gifs-img" src="${gif.images.original_still.url}" alt="${gif.title}"></img>
        </li>
      `);
    });
  },
  populateCategories: function (data) {
    offset = 0;
    gifsContainer.style.display = "none";
    loadMoreButton.style.display = "none";
    categoriesList.innerHTML = "";
    categoriesContainer.style.display = "block";
    gifsList.innerHTML = "";
    gifsTitle.innerHTML = "Categories";
    data.data.map((category) => {
      return (categoriesList.innerHTML += `
        <li class="categories-li" id=${category.id}>
          <h1 class="category-title">
            ${category.name}
          </h1>
          <img class="category-image" src="${category.gif.images.original_still.url}"></img>
        </li>
      `);
    });

    categoriesListItem = document.querySelectorAll(".categories-li");
    for (const item of categoriesListItem) {
      item.addEventListener("click", function (event) {
        controller.goToCategory(event);
      });
    }
  },
};

const controller = {
  starterFunction: function () {
    this.loadTrending();
    this.searchInput();
    this.getTrending();
    // this.getCategories();

    loadMoreButton.addEventListener("click", this.loadMore);
    categoriesButton.addEventListener("click", this.getCategories);
    navCategoryButtons.forEach((btn) =>
      btn.addEventListener("click", this.goToCategory)
    );
  },
  loadTrending: function () {
    loadMoreButton.style.display = "none";
    this.getGifs(
      `http://api.giphy.com/v1/gifs/trending?api_key=${config.API_KEY}&limit=${limit}`
    )
      .then((response) => response.json())
      .then((data) => {
        view.populateTrending(data);
      });
  },
  getGifs: async function (url) {
    const response = await fetch(url);
    return response;
  },
  getTrending: function () {
    trendingButton.addEventListener("click", () => this.loadTrending());
  },
  getSearch: function () {
    const searchQuery = searchField.value;
    lastSearch = searchQuery;
    controller
      .getGifs(
        `http://api.giphy.com/v1/gifs/search?q=${searchQuery}&api_key=${config.API_KEY}&limit=${limit}`
      )
      .then((response) => response.json())
      .then((data) => {
        view.populateGifs(data, searchQuery, true);
      });
  },
  getCategories: function () {
    controller
      .getGifs(
        `http://api.giphy.com/v1/gifs/categories?api_key=${config.API_KEY}`
      )
      .then((response) => response.json())
      .then((data) => {
        view.populateCategories(data);
      });
  },
  searchInput: function () {
    searchField.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        this.getSearch();
      }
    });
    searchButton.addEventListener("click", this.getSearch);
  },
  loadMore: function () {
    offset += 20;
    controller
      .getGifs(
        `http://api.giphy.com/v1/gifs/search?q=${lastSearch}&api_key=${config.API_KEY}&limit=${limit}&offset=${offset}`
      )
      .then((response) => response.json())
      .then((data) => {
        view.populateGifs(data, lastSearch, false);
      });
  },
  goToCategory: function () {
    const category = event.target.textContent;
    lastSearch = category;
    console.log(category);
    controller
      .getGifs(
        `http://api.giphy.com/v1/gifs/search?q=${category}&api_key=${config.API_KEY}&limit=${limit}&offset=${offset}`
      )
      .then((response) => response.json())
      .then((data) => {
        view.populateGifs(data, lastSearch, true);
      });
  },
};

// const model = {};

controller.starterFunction();
