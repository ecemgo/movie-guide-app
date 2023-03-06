//* https://www.omdbapi.com/?s=game&page=1&apikey=fc1fef96
//* http://www.omdbapi.com/?i=tt3896198&apikey=fc1fef96

const movieSearchBox = document.getElementById("movie-name");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");
const searchBtn = document.getElementById("search-btn");

//! load movies from API
async function loadMovies(searchTerm) {
  const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=${key}`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  // console.log(data.Search);
  if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  // console.log(searchTerm);
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

//! show the list of movies including the word entered
function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in data-id
    movieListItem.classList.add("search-list-item");
    if (movies[idx].Poster != "N/A") {
      moviePoster = movies[idx].Poster;
    } else {
      moviePoster = "images/image_not_found.png";
    }

    movieListItem.innerHTML = `
    <div class="search-item-thumbnail">
        <img src="${moviePoster}">
    </div>
    <div class="search-item-info">
        <h3>${movies[idx].Title}</h3>
        <p>${movies[idx].Year}</p>
    </div>
    `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

//! function to fetch data from api - it is for the search list
function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      // console.log(movie.dataset.id);
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      const result = await fetch(
        `http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=${key}`
      );
      const movieDetails = await result.json();
      // console.log(movieDetails);
      displayMovieDetails(movieDetails);
    });
  });
}

//! show movie details after selecting the movie from the search list
function displayMovieDetails(details) {
  resultGrid.innerHTML = `
  <div class="info">
      <img src=${
        details.Poster != "N/A" ? details.Poster : "images/image_not_found.png"
      } class="poster">
      <div>
        <h2>${details.Title}</h2>
        <div class="rating">
          <img src="images/star-icon.svg">
          <h4>${details.imdbRating}</h4>
          <span>(${details.imdbVotes})</span>
        </div>
        <div class="details">
          <span>${details.Rated}</span>
          <span>${details.Year}</span>
          <span>${details.Runtime}</span>
        </div>
        <div class="genre">
          <div>${details.Genre.split(",").join("</div><div>")}</div>
        </div>
      </div>
      <h3>Plot:</h3>
      <p>${details.Plot}</p>
      <h3>Cast:</h3>
      <p>${details.Actors}</p>
      <h3>Awards:</h3>
      <p>${details.Awards}</p>
  </div>
`;
}

//! function to fetch data from api - it is for 'Search' button and 'Enter' key
let getMovie = () => {
  let movieName = movieSearchBox.value;
  let url = `https://www.omdbapi.com/?t=${movieName}&apikey=${key}`;

  // input field is empty
  if (movieName.length <= 0) {
    resultGrid.innerHTML = `<h3 class="msg">Please enter a movie name</h3>`;
  } else {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // if movie exist in database
        if (data.Response == "True") {
          resultGrid.innerHTML = `
          <div class="info">
          <img src=${
            data.Poster != "N/A" ? data.Poster : "images/image_not_found.png"
          } class="poster">
            <div>
              <h2>${data.Title}</h2>
              <div class="rating">
                <img src="images/star-icon.svg">
                <h4>${data.imdbRating}</h4>
                <span>(${data.imdbVotes})</span>
              </div>
              <div class="details">
                <span>${data.Rated}</span>
                <span>${data.Year}</span>
                <span>${data.Runtime}</span>
              </div>
              <div class="genre">
                <div>${data.Genre.split(",").join("</div><div>")}</div>
              </div>
            </div>
            <h3>Plot:</h3>
            <p>${data.Plot}</p>
            <h3>Cast:</h3>
            <p>${data.Actors}</p>
            <h3>Awards:</h3>
            <p>${data.Awards}</p>
          </div>
        `;
        }
        // if movie doesn't exist in database
        else {
          resultGrid.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
        }
      })
      // if error occurs
      .catch(() => {
        resultGrid.innerHTML = `<h3 class="msg">Error Occured</h3>`;
      });
  }
};

//! click 'Search' button to get movie details
searchBtn.addEventListener("click", getMovie);
window.addEventListener("load", getMovie);

//! press 'Enter' key to get movie details
movieSearchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn.click();
    movieSearchBox.value = "";
    searchList.classList.add("hide-search-list");
  }
});

//! hide the search list when clicking anywhere except input
window.addEventListener("click", (e) => {
  if (e.target.className != "form-control") {
    searchList.classList.add("hide-search-list");
  }
});

movieSearchBox.addEventListener("keydown", selectElement);
window.curIndex = -1;

function selectElement(e) {
  var totalItems = document.querySelectorAll(".search-list-item").length;
  var selected = document.querySelector(".search-list-item.hover");
  console.log(e.keyCode);

  if (e.keyCode === 13 && selected) {
    movieSearchBox.value = selected.textContent;
  } else {
    console.log(window.curIndex);
    if (e.keyCode === 40) {
      window.curIndex = (window.curIndex + 1) % totalItems;
    } else if (e.keyCode === 38) {
      window.curIndex =
        window.curIndex <= 0 ? totalItems - 1 : window.curIndex - 1;
    }
    console.log(window.curIndex);
    if (selected) {
      selected.classList.remove("hover");
    }

    var selector =
      ".container .element:nth-child(" + (window.curIndex + 1) + ")";
    console.log(selector);
    selected = document.querySelector(selector);
    if (selected) {
      console.log("Adding hover");
      selected.classList.add("hover");
    }
  }
}
