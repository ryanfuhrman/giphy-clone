async function getTrending(url) {
  const response = await fetch(url);
  console.log(response);
  // return response.json();
}

getTrending("api.giphy.com/v1/gifs/trending").then((data) => console.log(data));
