document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.getElementById("booking-form");
    const bookingList = document.getElementById("booking-list");
    const filterCategory = document.getElementById("filter-category");

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const date = document.getElementById("date").value;
        const busNumber = document.getElementById("bus-number").value;

        if (!/^\d{10}$/.test(phone)) {
            alert("Phone number must be exactly 10 digits.");
            return;
        }

        const booking = {
            id: Date.now(),
            name,
            email,
            phone,
            date,
            busNumber
        };

        bookings.push(booking);
        localStorage.setItem("bookings", JSON.stringify(bookings));
        displayBookings(bookings);

        bookingForm.reset();
    });

    filterCategory.addEventListener("change", () => {
        const category = filterCategory.value;
        if (category === "All") {
            displayBookings(bookings);
        } else {
            const filtered = bookings.filter(booking => booking.busNumber === category);
            displayBookings(filtered);
        }
    });

    bookingList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const id = parseInt(e.target.dataset.id);
            bookings = bookings.filter(booking => booking.id !== id);
            localStorage.setItem("bookings", JSON.stringify(bookings));
            displayBookings(bookings);
        }

        if (e.target.classList.contains("edit-btn")) {
            const id = parseInt(e.target.dataset.id);
            const booking = bookings.find(booking => booking.id === id);

            document.getElementById("name").value = booking.name;
            document.getElementById("email").value = booking.email;
            document.getElementById("phone").value = booking.phone;
            document.getElementById("date").value = booking.date;
            document.getElementById("bus-number").value = booking.busNumber;

            bookings = bookings.filter(booking => booking.id !== id);
            localStorage.setItem("bookings", JSON.stringify(bookings));
            displayBookings(bookings);
        }
    });

    function displayBookings(bookings) {
        bookingList.innerHTML = "";
        bookings.forEach(booking => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${booking.name}</td>
                <td>${booking.email}</td>
                <td>${booking.phone}</td>
                <td>${booking.date}</td>
                <td>${booking.busNumber}</td>
                <td>
                    <button class="edit-btn" data-id="${booking.id}">Edit</button>
                    <button class="delete-btn" data-id="${booking.id}">Delete</button>
                </td>
            `;

            bookingList.appendChild(row);
        });
    }
    displayBookings(bookings);
});
