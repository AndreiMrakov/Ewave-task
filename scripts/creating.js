// simple functions
// import {gId, qSel, createEl, getVal} from './base';

//create all static vars
let films_archive = [];
let films_container = gId('films-list');
let add_film = gId('add-film-form');

let new_film_title = qSel('input[name="film-title"]');
let new_film_year = qSel('input[name="film-year"]');

//adding max and min attributes to the year of the film
new_film_year.setAttribute('max', new Date().getFullYear());
new_film_year.setAttribute('min', 1888);

let createFilm = (obj) => {
    //creating new film components
    let new_film_container = createEl('div', 'film-container');
    let new_film_full_title = createEl('div', 'film-full-title');
    let new_film_stars_container = createEl('div', 'stars-container');
    let new_film_stars = new Array(5);

    for (let i = 0; i < new_film_stars.length; i++) {
        new_film_stars[i] = createEl('div', 'star-item');
        new_film_stars[i].setAttribute('data-rating', i + 1);
    }

    //fulling components with values
    let new_film_full_title_string = `${obj.title} (${obj.year})`;
    if (new_film_full_title_string.length > 25) {
        new_film_full_title.textContent = `${new_film_full_title_string.slice(0, 25)}...`;
    } else new_film_full_title.textContent = new_film_full_title_string;

    //adding listeners to rate stars
    new_film_stars.forEach((star, index) => {
        if (index < obj.rate - 1) {
            star.classList.add('active');
        } else if (index === obj.rate - 1) {
            star.classList.add('active', 'current-active');
        }

        const clickStar = () => {
            //updating new value of rate
            obj.rate === index + 1 ? obj.rate = 0 : obj.rate = index + 1;
            // refresh films rendering !!!!!!!!!!!!!!!!! MUTATE ORIGINAL ARRAY (there we can mutate coz there is no nosort rendering)!!!!!!!
            films_archive.sort((a, b) => {
                if (+a.rate !== +b.rate) {
                    return +b.rate - +a.rate;
                } else if (a.title > b.title) {
                    return 1;
                } else return -1;
            });
            localStorage.setItem('films', JSON.stringify(films_archive));
            renderFunc();
        };
        const addStar = () => {
            if (index >= obj.rate - 1) {
                new_film_stars.forEach((str, ind) => {
                    if (ind <= index) {
                        str.classList.add('active');
                    }
                });
            } else {
                new_film_stars.forEach((str, ind) => {
                    if (ind > index) {
                        str.classList.remove('active');
                    }
                });
            }
        };
        const removeStar = () => {
            new_film_stars.forEach((str, ind) => {
                if (ind < obj.rate - 1) {
                    str.classList.add('active');
                } else if (ind > obj.rate - 1) {
                    str.classList.remove('active');
                } else if (ind === obj.rate - 1) {
                    str.classList.add('active', 'current-active');
                }
            });

        };

        star.addEventListener('click', clickStar);
        star.addEventListener('mouseover', addStar);
        star.addEventListener('mouseout', removeStar);
    });

    //creating rate block
    new_film_stars.forEach(star => new_film_stars_container.appendChild(star));

    //creating new film block
    [new_film_full_title, new_film_stars_container].forEach(child => new_film_container.appendChild(child));

    //inserting new film in page
    films_container.appendChild(new_film_container);
};


// imitation of rendering
let renderFunc = () => {
    [new_film_title, new_film_year].forEach(input => input.value = '');
    films_container.innerHTML = '';
    let memory_archive = JSON.parse(localStorage.getItem('films'));
    if (memory_archive) {
        films_archive = [...memory_archive];
    }
    films_archive.forEach(film => createFilm(film));
    new_film_title.focus();
};
//add film func
let addFilm = (e) => {
    e.preventDefault();
    let new_title = getVal(new_film_title).toLowerCase().split(' ').map(word => ((word.length > 2) ? (word.charAt(0).toUpperCase() + word.slice(1)) : word));
    let newFilm = {
        id: films_archive.length + 1,
        title: new_title.join(' '),
        year: getVal(new_film_year),
        rate: 0,
    };
    films_archive.push(newFilm);
    localStorage.setItem('films', JSON.stringify(films_archive));
    renderFunc();
};

window.addEventListener('load', renderFunc);
add_film.addEventListener('submit', addFilm);
