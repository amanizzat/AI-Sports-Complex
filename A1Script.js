// Set active page
const navLinks = document.querySelectorAll('nav ul li a');
// Loop through each link
navLinks.forEach(link => {
	// Check if the href of the link matches the current page's filename
	if (link.href === window.location.href)
	{
		link.classList.add('active'); // Add 'active' class to the current page
	}
});

const facilities = [
    "Gymnasium",
    "Swimming Pool",
    "Squash Courts",
    "Badminton Courts",
    "Football Field",
    "Tennis Courts",
    "Running Track",
    "Locker Rooms",
    "Sports Cafe",
    "Prayer Room"
];

const searchInput = document.getElementById('facilitySearch');
const suggestionList = document.getElementById('suggestionList');

// Show dropdown when search bar is clicked (focused)
searchInput.addEventListener('focus', () => {
    populateFacilities();
    suggestionList.style.display = 'block';
});

// Hide dropdown when clicking outside the search bar
document.addEventListener('click', (event) => {
    if (!searchInput.contains(event.target) && !suggestionList.contains(event.target)) {
        suggestionList.style.display = 'none';
    }
});

// Filter facilities dynamically as user types
searchInput.addEventListener('keyup', filterFacilities);

function populateFacilities() {
    suggestionList.innerHTML = '';
    facilities.forEach(facility => {
        const listItem = document.createElement('li');
        listItem.textContent = facility;
        listItem.onclick = () => selectFacility(facility);
        suggestionList.appendChild(listItem);
    });
}

function filterFacilities() {
    const input = searchInput.value.toLowerCase();
    suggestionList.innerHTML = '';

    if (input) {
        const matches = facilities.filter(facility => facility.toLowerCase().includes(input));
        matches.forEach(facility => {
            const listItem = document.createElement('li');
            listItem.textContent = facility;
            listItem.onclick = () => selectFacility(facility);
            suggestionList.appendChild(listItem);
        });
        suggestionList.style.display = matches.length ? 'block' : 'none';
        
        // Filter facility sections based on the keyword
        filterVisibleSections(input);
    } else {
        // If input is empty, show all facilities
        const facilitySections = document.querySelectorAll('.facilitySection');
        facilitySections.forEach(section => {
            section.style.display = 'flex';
        });
        suggestionList.style.display = 'none'; // Hide the suggestion list
    }
}


function selectFacility(facility) {
    searchInput.value = facility;
    filterVisibleSections(facility.toLowerCase());
    suggestionList.style.display = 'none';
}

function filterVisibleSections(keyword) {
    const facilitySections = document.querySelectorAll('.facilitySection');
    facilitySections.forEach(section => {
        const facilityText = section.getAttribute('data-facility');
        section.style.display = facilityText.includes(keyword) ? 'flex' : 'none';
    });
}


function booking() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const facility = document.getElementById('facility').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const membership = document.getElementById('membership').value;

    const message = `
        Booking Confirmed!\n
        Name: ${name}\n
        Email: ${email}\n
        Facility: ${facility}\n
        Date: ${date}\n
        Time: ${time}\n
        Membership Plan: ${membership}\n
        Thank you for booking with AI Sports Complex!
    `;

    alert(message);
    document.getElementById('bookingForm').reset(); // Reset the form after submission
}
