// import watchlistData from "./index.js"
const watchlistData = JSON.parse(localStorage.getItem("watchlistArray")) || []
const placeholderText = document.getElementById("watchlist-background-img")
const watchlistContainer = document.getElementById("watchlist-container")
const removeBtn = document.getElementsByClassName("remove-btn-watchlist")

if (watchlistData.length != 0) {
  placeholderText.remove()
}

function addToWatchlist() {
  watchlistData.forEach(movie => {
    fetch(`https://www.omdbapi.com/?i=${movie}&apikey=5abdd82b`)
      .then(res => res.json())
      .then(data => {
        getMovieHtml(data)
      })
  })
}

function getMovieHtml(data) {
  watchlistContainer.innerHTML += `
  <div class="movie-container">
    <img class="movie-img" src="${data.Poster}">
    <div class="movie-info-container">
      <div class="title-container">
        <h3 class="movie-title">${data.Title}</h3>
        <span class="movie-rating">⭐${data.imdbRating}</span>
      </div>
      <div class="info-container">
        <span class="movie-runtime">${data.Runtime}</span>
        <span class="movie-genre">${data.Genre}</span>
        <button id=${data.imdbID} class="add-watchlist remove-btn-watchlist">Remove</button>
      </div>
      <p class"movie-plot">${data.Plot}</p>
    </div>
  </div>
  `
  removeMovie()
}

addToWatchlist()

function removeMovie() {
  for (let i = 0; i < removeBtn.length; i++) {
    const removeBtnId = removeBtn[i].id
    removeBtn[i].addEventListener("click", () => {
      watchlistContainer.firstElementChild.remove()
      const index = watchlistData.indexOf(removeBtnId)
      if (index > -1) {
        watchlistData.splice(index, 1)
      }
      localStorage.setItem(
        "watchlistArray",
        JSON.stringify(watchlistData) || []
      )
    })
  }
}
