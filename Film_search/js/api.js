
const movieSearchBox = document.getElementById('input-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');


async function fetchMovies(searchTerm) {
    // const fullURL = `${BASE_URL}${query}&page=1&apikey=${API_KEY}`;
    const fullURL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=ffb02dc1`;
    const res = await fetch(fullURL);
    const data = await res.json();

    // console.log(data, Search);
    if(data.Response == "True")
        displayMovieList(data.Search)
}
function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length>0){
        searchList.classList.remove('hide-search-list');
        fetchMovies(searchTerm);
    }
    else{
        searchList.classList.add('hide-search-list');
    }
}
function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list-item');
        let moviePoster;
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else
            moviePoster = "not_found.webp"; 

        movieListItem.innerHTML = `
            <div class="search-list-start">
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

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
             searchList.classList.add('hide-search-list');
             movieSearchBox.value = "";
             const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=ffb02dc1`);
             const movieDetails = await result.json();
            console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    })
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="${(details.Poster != "N/A")?details.Poster : "not_found.webp"}" alt="poster" >
    </div>
    <div class="movie-info">
        <h3 class="movie-title">Title: ${details.Title}</h3>
                         
        <ul class="movie-misc-info">
        <li class="year">Year: ${details.Year}</li>
        <li class="released">Released: ${details.Released} </li>
        <li class="rated">Rated: ${details.Rated}</li>
        </ul><br>
        <p class="genre"> <b>Genre: </b>${details.Genre}</p><br>
        <p class="writer"> <b>Writer: </b>${details.Writer}</p><br>
        <p class="actors"> <b>Actors: </b>${details.Actors}</p><br>
        <p class="plot"> <b>Plot: </b>${details.Plot}</p> <br>
        <p class="language"><b>Language: </b> ${details.Language}</p> <br>
        <p class="awards"><b>Awards: </b> <i class="fas fa-award"></i>${details.Awards}</p><br>
    </div><br>`;
}