// didplays movie details on page
document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/films/1")
    .then(response => response.json())
    .then(movie => {
        // Update all HTML elements with movie details
        const movieDetails = document.getElementById("movie-details");
        movieDetails.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" />
            <h2>${movie.title}</h2>
            <p>Runtime: ${movie.runtime} minutes</p>
            <p>Showtime: ${movie.showtime}</p>
            <p>Description: ${movie.description}</p>
            <p>Tickets Available: ${movie.capacity - movie.tickets_sold}</p>
        `;
    })
    .catch(error => console.error("Error fetching movie details:", error));
});

// displays menus of movies
document.addEventListener("DOMContentLoaded", () => {
    // gets all movies by using fetch
    fetch("http://localhost:3000/films")
    .then(response => response.json())
    .then(movies => {
        // update all  HTML elements with movie menu
        const filmList = document.getElementById("films");
        filmList.innerHTML = ""; // Clear placeholder li element
        movies.forEach(movie => {
            const filmItem = document.createElement("li");
            filmItem.classList.add("film", "item"); // Optional styling
            filmItem.textContent = movie.title;
            filmList.appendChild(filmItem);
        });
    })
    .catch(error => console.error("Error fetching movies:", error));
});
// buying tickets for any movie
document.addEventListener("DOMContentLoaded", () => {
    // Event listener for Buy Ticket button
    document.getElementById("buy-ticket").addEventListener("click", () => {
        // Fetch movie details again to get latest tickets sold count
        fetch("http://localhost:3000/films/1")
        .then(response => response.json())
        .then(movie => {
            const availableTickets = movie.capacity - movie.tickets_sold;
            if (availableTickets > 0) {
                const updatedTicketsSold = movie.tickets_sold + 1;
                // Update tickets sold on the server for the movie
                fetch(`http://localhost:3000/films/${movie.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        tickets_sold: updatedTicketsSold
                    })
                })
                .then(response => response.json())
                .then(updatedMovie => {
                    // Update front display with the updated tickets sold count
                    const ticketsSoldDisplay = document.getElementById("tickets-sold");
                    ticketsSoldDisplay.textContent = updatedMovie.tickets_sold;
                    //  update button text if tickets are sold out
                    if (updatedMovie.tickets_sold === updatedMovie.capacity) {
                        document.getElementById("buy-ticket").textContent = "Sold Out";
                    }
                })
                .catch(error => console.error("Error updating tickets sold:", error));
            } else {
                // Handle when all tickets are sold out
                alert("Sorry, this movie is sold out!");
            }
        })
        .catch(error => console.error("Error fetching movie details:", error));
    });
});
// to delete or remove any movie in your list
document.addEventListener("DOMContentLoaded", () => {
    // Event listener for Delete button
    document.getElementById("delete-movie").addEventListener("click", () => {
        // Fetch movie ID to delete
        const movieIdToDelete = 1; // Example: Delete first movie
        fetch(`http://localhost:3000/films/${movieIdToDelete}`, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) {
        
                const movieItemToDelete = document.querySelector(`.film.item[data-id="${movieIdToDelete}"]`);
                movieItemToDelete.remove();
            } else {
                console.error("Error deleting movie:", response.status);
            }
        })
        .catch(error => console.error("Error deleting movie:", error));
    });
});

