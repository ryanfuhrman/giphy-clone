// 1. displays trending gifs on app load shown in a column/grid
// 2. has an input which allows you to search for specific gifs
// 3. at the bottom of the results, there is a ‘load more’ button, which gets more gifs using that search term.

const gifsList = document.querySelector(".gifs-list");
const gifsTitle = document.querySelector(".gifs-title");
const search = document.querySelector(".gif-search");
const trendingButton = document.querySelector(".trending-button");
const searchButton = document.querySelector(".gif-search-button");
const limit = 10;

const view = {
  populateTrending: function (data) {
    gifsList.innerHTML = "";
    gifsTitle.innerHTML = "Trending GIFs";
    data.data.map((gif) => {
      return (gifsList.innerHTML += `<li id="${gif.id}">
          <img src="${gif.images.original.url}" alt="${gif.title}"></img>
        </li>`);
    });
  },
  populateSearch: function (data, searchQuery) {
    gifsList.innerHTML = "";
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
    this.trendingGifs();
    this.searchInput();
    this.getTrending();
  },
  trendingGifs: function () {
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
    trendingButton.addEventListener("click", () => this.trendingGifs());
  },
  searchInput: function () {
    searchButton.addEventListener("click", () => {
      const searchQuery = search.value;
      this.getGifs(
        `http://api.giphy.com/v1/gifs/search?q=${searchQuery}&api_key=${config.API_KEY}&limit=${limit}`
      )
        .then((response) => response.json())
        .then((data) => {
          view.populateSearch(data, searchQuery);
        });
    });
  },
};

const model = {};

controller.starterFunction();
