const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")
const resultsContainer = document.getElementById("results-container")
const placeholderImage = document.getElementById("background-img")
const watchlistBtn = document.getElementsByClassName("add-watchlist")
let watchlistArray = []

searchBtn.addEventListener("click", getMovieApi)
searchInput.addEventListener("keyup", e => {
  if (e.keyCode === 13) {
    getMovieApi()
  }
})

function getMovieApi() {
  let movieArray = []
  fetch(`https://www.omdbapi.com/?s=${searchInput.value}&apikey=5abdd82b`)
    .then(res => res.json())
    .then(data => {
      if (data.Response !== "False") {
        data.Search.forEach(movie => {
          const movieId = movie.Title
          fetch(`https://www.omdbapi.com/?t=${movieId}&apikey=5abdd82b`)
            .then(res => res.json())
            .then(data => {
              placeholderImage.remove()
              movieArray.push(data)
              getMovieHtml(movieArray)
            })
        })
      } else {
        resultsContainer.innerHTML = `<div class="error-container">
        <p>Oops! Unable to find what you're looking for.<br/>Please try another search.</p>
        </div>`
      }
    })
}

function getMovieHtml(movieArray) {
  resultsContainer.innerHTML = ``
  for (let movies of movieArray) {
    resultsContainer.innerHTML += `
        <div class="movie-container">
          <img class="movie-img" src="${movies.Poster}">
          <div class="movie-info-container">
            <div class="title-container">
              <h3 class="movie-title">${movies.Title}</h3>
              <span class="movie-rating">⭐${movies.imdbRating}</span>
            </div>
            <div class="info-container">
              <span class="movie-runtime">${movies.Runtime}</span>
              <span class="movie-genre">${movies.Genre}</span>
              <button id="${movies.imdbID}" class="add-watchlist" data-clicked="false">Watchlist</button>
            </div>
            <p class"movie-plot">${movies.Plot}</p>
          </div>
        </div>
        `
  }
  AddRemoveMovie()
}

function AddRemoveMovie() {
  let watchlistArray = JSON.parse(localStorage.getItem("watchlistArray")) || []

  for (let i = 0; i < watchlistBtn.length; i++) {
    const imdbMovieID = watchlistBtn[i].id

    if (watchlistArray.includes(imdbMovieID)) {
      watchlistBtn[i].innerText = "Remove"
    }

    watchlistBtn[i].addEventListener("click", event => {
      if (event.target.textContent === "Watchlist") {
        watchlistBtn[i].innerText = "Remove"

        // push ID to watchlistArray
        watchlistArray.push(imdbMovieID)
        localStorage.setItem("watchlistArray", JSON.stringify(watchlistArray))
      } else if (event.target.textContent === "Remove") {
        watchlistBtn[i].innerText = "Watchlist"
        const index = watchlistArray.indexOf(imdbMovieID)
        if (index > -1) {
          watchlistArray.splice(index, 1)
        }

        localStorage.setItem("watchlistArray", JSON.stringify(watchlistArray))
      }
    })
  }
}

// localStorage.clear()
