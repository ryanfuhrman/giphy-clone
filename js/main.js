const view = {
  populateTrending: function (data) {
    data.data.map((gif) => {
      return (trendingList.innerHTML += `<li id="${gif.id}">
          <img src="${gif.images.original.url}" alt="${gif.title}"></img>
        </li>`);
    });
  },
};

const controller = {
  starterFunction: function () {
    this.getTrending(
      `http://api.giphy.com/v1/gifs/trending?api_key=${config.API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        view.populateTrending(data);
        console.log(data);
      });
  },
  getTrending: async function (url) {
    const response = await fetch(url);
    return response;
  },
};

const model = {};

const trendingList = document.querySelector(".trending-gifs-list");

controller.starterFunction();
