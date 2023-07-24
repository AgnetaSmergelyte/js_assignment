//login
const loginDiv = document.querySelector('.login')
const loginUsernameInput = document.querySelector('.login input');
const loginErrorMsg = document.querySelector('.login p');
const btnLogin = document.querySelector('.login button');
//main menu
const mainPageDiv = document.querySelector('.main-page');
const profileCardDiv = document.querySelector('.profile-card');
const moviesCardDiv = document.querySelector('.movies-card');
//profile page
const profilePageDiv = document.querySelector('.profile-page');
const profileImageInput = document.querySelector('#user-photo-url');
const profileUsernameInput = document.querySelector('#username-input');
const profileGenderSelect = document.querySelector('#gender-select');
const btnsProfileEdit = document.querySelectorAll('.user-profile button')
const editErrorMessage = document.querySelector('.profile-change p')
//movies
const moviesDiv = document.querySelector('.movies');
const movieCards = document.querySelectorAll('.movies img');
const btnBackToMainFromMovies = document.querySelector('.movies button')
//movie-reservation
const movieReservationDiv = document.querySelector('.movie-reservation');
const seatsContainerDiv = document.querySelector('.seats');
let seatsDivs = document.querySelectorAll('.seats > div');
const btnsReservation = document.querySelectorAll('.movie-reservation button');
const seatsAvailableSpans = document.querySelectorAll('.movies span');
//user photos and usernames to update
const avatars = document.querySelectorAll('.user-avatar');
const userProfileImage = document.querySelector('.user-profile > img');
const usernamesInNavigation = document.querySelectorAll('.top-nav > p');
//movie info fields to update
const movieCover = document.querySelector('.movie-info img');
const movieTitle = document.querySelector('.movie-info h2');
const movieYear = document.querySelector('.movie-info h3');
const movieGenre = document.querySelector('.movie-info h4');

let currentUser = {
    name: null,
    image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    gender: null,
    reservations: [[], [], []]
};
const movieInfoArray = [
    {
        cover: "https://m.media-amazon.com/images/M/MV5BMmFlMDBmNzEtM2QxNS00MzUyLTk1YTAtZTQ3ODM5YThlOTFhXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_QL75_UY281_CR1,0,190,281_.jpg",
        title: "Cemetery Man",
        year: 1994,
        genre: "Horror/Comedy"
    },
    {
        cover: "https://m.media-amazon.com/images/M/MV5BMjA1Mzk4OTAyOV5BMl5BanBnXkFtZTcwNzQ1NjcxMQ@@._V1_.jpg",
        title: "Pet Sematary",
        year: 1989,
        genre: "Horror/Thriller"
    },
    {
        cover: "https://m.media-amazon.com/images/M/MV5BNjE5ZTU2ZjAtNjRlZS00ZmI4LWI4ZjEtZWI0NTM2ODE3ZWY1XkEyXkFqcGdeQXVyMTY5Nzc4MDY@._V1_.jpg",
        title: "The Graveyard",
        year: 2006,
        genre: "Horror/Slasher"
    }
]
let movieSeatsArray = [[], [], []];
let currentMovieIndex = null;

const setMovieSeatsArrays = () => {
    if (!localStorage.getItem('movieSeats')) {
        for (let i = 0; i < movieSeatsArray.length; i++) {
            for (let j = 0; j < 24; j++) {
                movieSeatsArray[i][j] = 'empty';
            }
        }
        localStorage.setItem('movieSeats', JSON.stringify(movieSeatsArray));
        seatsAvailableSpans.forEach(span => span.textContent = '24')
    } else {
        movieSeatsArray = JSON.parse(localStorage.getItem('movieSeats'));
        seatsAvailableSpans.forEach((span, i) => {
            span.textContent = movieSeatsArray[i].filter(x => x === 'empty').length.toString();
        })
    }
}
setMovieSeatsArrays();
const generateSeats = (arr) => {
    seatsContainerDiv.innerHTML = "";
    for (let i = 0; i < 24; i++) {
        if (arr[i] === 'empty') {
            seatsContainerDiv.innerHTML += "<div><i class=\"fas fa-couch\"></i></div>"
        } else {
            seatsContainerDiv.innerHTML += arr[i];
        }
    }
}
const updateUserImage = (imageUrl) => {
    userProfileImage.src = imageUrl;
    avatars.forEach(avatar => avatar.style.backgroundImage = `url(${imageUrl})`);
}
const updateMovieSeatsArrays = () => {
    for (let i = 0; i < currentUser.reservations.length; i++) {
        for (let j = 0; j < currentUser.reservations[i].length; j++) {
            const seatNum = currentUser.reservations[i][j];
            movieSeatsArray[i][seatNum] = `<div><div><img src="${currentUser.image}" alt=""/>${currentUser.name}</div></div>`;
        }
    }
    localStorage.setItem('movieSeats', JSON.stringify(movieSeatsArray));
}

//click events
{
    btnLogin.onclick = () => {
        if (loginUsernameInput.value.length === 0) {
            loginErrorMsg.textContent = "Enter username";
            return;
        }
        if (loginUsernameInput.value === 'movieSeats') {
            loginErrorMsg.textContent = "Wrong username";
            return;
        }
        currentUser.name = loginUsernameInput.value;
        usernamesInNavigation.forEach(p => p.textContent = currentUser.name);
        if (localStorage.getItem(currentUser.name)) {
            currentUser = JSON.parse(localStorage.getItem(currentUser.name));
            if (currentUser.image) {
                updateUserImage(currentUser.image);
            }
        } else {
            localStorage.setItem(currentUser.name, JSON.stringify(currentUser));
        }
        loginDiv.style.display = 'none';
        mainPageDiv.style.display = 'block';
    }

    profileCardDiv.onclick = () => {
        mainPageDiv.style.display = 'none';
        profilePageDiv.style.display = 'block';
        editErrorMessage.textContent = "";
    }

    moviesCardDiv.onclick = () => {
        mainPageDiv.style.display = 'none';
        moviesDiv.style.display = 'flex';
    }

    btnsProfileEdit[0].onclick = () => {
        //profile edit
        const newUsername = profileUsernameInput.value;
        if (localStorage.getItem(newUsername)) {
            editErrorMessage.textContent = "Username is taken"
            return;
        }
        editErrorMessage.textContent = "";
        const newImage = profileImageInput.value;
        const newGender = profileGenderSelect.value
        localStorage.removeItem(currentUser.name);

        if (newGender) currentUser.gender = newGender;
        if (newImage) {
            currentUser.image = newImage;
            updateUserImage(newImage);
        }
        if (newUsername) {
            currentUser.name = newUsername;
            usernamesInNavigation.forEach(p => p.textContent = newUsername);
        }
        localStorage.setItem(currentUser.name, JSON.stringify(currentUser));
        updateMovieSeatsArrays();
    }

    btnsProfileEdit[1].onclick = () => {
        //back to main page
        profilePageDiv.style.display = 'none';
        mainPageDiv.style.display = 'block';
    }

    btnBackToMainFromMovies.onclick = () => {
        moviesDiv.style.display = 'none'
        mainPageDiv.style.display = 'block';
    }

    movieCards.forEach((card, index) => {
        card.onclick = () => {
            currentMovieIndex = index;
            moviesDiv.style.display = 'none'
            movieReservationDiv.style.display = 'flex';
            movieCover.src = movieInfoArray[index].cover;
            movieTitle.textContent = movieInfoArray[index].title;
            movieYear.textContent = movieInfoArray[index].year;
            movieGenre.textContent = movieInfoArray[index].genre;
            generateSeats(movieSeatsArray[index]);
            seatsDivs = document.querySelectorAll('.seats > div');
            seatsDivs.forEach((seat, i) => {
                seat.onclick = (e) => {
                    if (movieSeatsArray[index][i] !== 'empty') return;
                    if (e.target.classList.contains('selected')) {
                        e.target.classList.remove('selected')
                    } else {
                        e.target.classList.add('selected')
                    }
                }
            })
        }
    })

    btnsReservation[0].onclick = () => {
        //reserve seats
        seatsDivs.forEach((seat, index) => {
            if (seat.classList.contains('selected')) {
                seat.innerHTML = `<div><img src="${currentUser.image}" alt=""/>${currentUser.name}</div>`
                seat.classList.remove('selected');
                movieSeatsArray[currentMovieIndex][index] = `<div><div><img src="${currentUser.image}" alt=""/>${currentUser.name}</div></div>`;
                localStorage.setItem('movieSeats', JSON.stringify(movieSeatsArray));
                seatsAvailableSpans[currentMovieIndex].textContent = movieSeatsArray[currentMovieIndex].filter(x => x === 'empty').length.toString();
                currentUser.reservations[currentMovieIndex].push(index)
                localStorage.setItem(currentUser.name, JSON.stringify(currentUser));
            }
        })
    }
    btnsReservation[1].onclick = () => {
        for (let i = 0; i < currentUser.reservations[currentMovieIndex].length; i++) {
            const seatNum = currentUser.reservations[currentMovieIndex][i];
            movieSeatsArray[currentMovieIndex][seatNum] = `empty`;
            seatsDivs[seatNum].innerHTML = "<i class=\"fas fa-couch\"></i>";
        }
        seatsAvailableSpans[currentMovieIndex].textContent = movieSeatsArray[currentMovieIndex].filter(x => x === 'empty').length.toString();
        localStorage.setItem('movieSeats', JSON.stringify(movieSeatsArray));
        currentUser.reservations[currentMovieIndex] = [];
    }
    btnsReservation[2].onclick = () => {
        movieReservationDiv.style.display = 'none'
        moviesDiv.style.display = 'flex';
        currentMovieIndex = null;
    }
}

