document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.getElementById("booking-form");
    const bookingList = document.getElementById("booking-list");
    const filterCategory = document.getElementById("filter-category");

    const apiBaseUrl = "https://crudcrud.com/api/39b13cc8a09245bca20a79e04fcc9454/bookings";
    let editingBookingId = null;

    async function fetchBookings() {
        try {
            const response = await axios.get(apiBaseUrl);
            displayBookings(response.data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    }

    async function addBooking(booking) {
        try {
            await axios.post(apiBaseUrl, booking);
            fetchBookings();
        } catch (error) {
            console.error("Error adding booking:", error);
        }
    }

    async function deleteBooking(id) {
        try {
            await axios.delete(`${apiBaseUrl}/${id}`);
            fetchBookings();
        } catch (error) {
            console.error("Error deleting booking:", error);
        }
    }

    async function editBooking(id, updatedBooking) {
        try {
            await axios.put(`${apiBaseUrl}/${id}`, updatedBooking);
            fetchBookings();
        } catch (error) {
            console.error("Error editing booking:", error);
        }
    }

    bookingForm.addEventListener("submit", async (e) => {
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

        const booking = { name, email, phone, date, busNumber };

        if (editingBookingId) {
            await editBooking(editingBookingId, booking);
            editingBookingId = null;
        } else {
            await addBooking(booking);
        }

        bookingForm.reset();
    });

    filterCategory.addEventListener("change", async () => {
        const category = filterCategory.value;
        try {
            const response = await axios.get(apiBaseUrl);
            const bookings = response.data;

            if (category === "All") {
                displayBookings(bookings);
            } else {
                const filtered = bookings.filter((booking) => booking.busNumber === category);
                displayBookings(filtered);
            }
        } catch (error) {
            console.error("Error filtering bookings:", error);
        }
    });

    bookingList.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;

        if (e.target.classList.contains("delete-btn")) {
            await deleteBooking(id);
        }

        if (e.target.classList.contains("edit-btn")) {
            try {
                const response = await axios.get(`${apiBaseUrl}/${id}`);
                const booking = response.data;

                document.getElementById("name").value = booking.name;
                document.getElementById("email").value = booking.email;
                document.getElementById("phone").value = booking.phone;
                document.getElementById("date").value = booking.date;
                document.getElementById("bus-number").value = booking.busNumber;

                editingBookingId = id;
            } catch (error) {
                console.error("Error fetching booking for edit:", error);
            }
        }
    });

    function displayBookings(bookings) {
        bookingList.innerHTML = "";
        bookings.forEach((booking) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${booking.name}</td>
                <td>${booking.email}</td>
                <td>${booking.phone}</td>
                <td>${booking.date}</td>
                <td>${booking.busNumber}</td>
                <td>
                    <button class="edit-btn" data-id="${booking._id}">Edit</button>
                    <button class="delete-btn" data-id="${booking._id}">Delete</button>
                </td>
            `;

            bookingList.appendChild(row);
        });
    }

    fetchBookings();
});
