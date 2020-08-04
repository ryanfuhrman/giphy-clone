// 1. displays trending gifs on app load shown in a column/grid
// 2. has an input which allows you to search for specific gifs
// 3. at the bottom of the results, there is a ‘load more’ button, which gets more gifs using that search term.

const gifsList = document.querySelector(".gifs-list");
const gifsTitle = document.querySelector(".gifs-title");
const trendingButton = document.querySelector(".trending-button");
const searchField = document.querySelector(".gif-search-input");
const searchButton = document.querySelector(".gif-search-button");
const loadMoreButton = document.querySelector(".load-more-button");
const limit = 10;
let offset = 0;
let lastSearch = "";

const view = {
  populateTrending: function (data) {
    offset = 0;
    gifsList.innerHTML = "";
    gifsTitle.innerHTML = "Trending GIFs";
    data.data.map((gif) => {
      return (gifsList.innerHTML += `<li id="${gif.id}">
          <img src="${gif.images.original.url}" alt="${gif.title}"></img>
        </li>`);
    });
  },
  populateSearch: function (data, searchQuery, clearResults) {
    searchField.value = "";
    if (clearResults) {
      gifsList.innerHTML = "";
      offset = 0;
    }
    gifsTitle.innerHTML = `Results for "${searchQuery}"`;
    data.data.map((gif) => {
      return (gifsList.innerHTML += `<li id="${gif.id}">
          <img src="${gif.images.original.url}" alt="${gif.title}"></img>
        </li>`);
    });
  },
};

const controller = {
  starterFunction: function () {
    this.getTrending();
    this.searchInput();
    this.getTrendingByButton();

    loadMoreButton.addEventListener("click", this.loadMore);
  },
  getTrending: function () {
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
  getTrendingByButton: function () {
    trendingButton.addEventListener("click", () => this.getTrending());
  },
  getSearch: function () {
    loadMoreButton.style.display = "block";
    const searchQuery = searchField.value;
    lastSearch = searchQuery;
    this.getGifs(
      `http://api.giphy.com/v1/gifs/search?q=${searchQuery}&api_key=${config.API_KEY}&limit=${limit}`
    )
      .then((response) => response.json())
      .then((data) => {
        view.populateSearch(data, searchQuery, true);
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
    offset += 10;
    controller
      .getGifs(
        `http://api.giphy.com/v1/gifs/search?q=${lastSearch}&api_key=${config.API_KEY}&limit=${limit}&offset=${offset}`
      )
      .then((response) => response.json())
      .then((data) => {
        view.populateSearch(data, lastSearch, false);
      });
  },
};

const model = {};

controller.starterFunction();
