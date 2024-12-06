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

// Array facilities for booking
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

// Dynamically updates a list of facility suggestions
function populateFacilities() {
    suggestionList.innerHTML = '';
    facilities.forEach(facility => {
        const listItem = document.createElement('li');
        listItem.textContent = facility;
        listItem.onclick = () => selectFacility(facility);
        suggestionList.appendChild(listItem);
    });
}

// Filter facility based on user input
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

// Select facility from suggestion list
function selectFacility(facility) {
    searchInput.value = facility;
    filterVisibleSections(facility.toLowerCase());
    suggestionList.style.display = 'none';
}

// Only display what user search
function filterVisibleSections(keyword) {
    const facilitySections = document.querySelectorAll('.facilitySection');
    facilitySections.forEach(section => {
        const facilityText = section.getAttribute('data-facility');
        section.style.display = facilityText.includes(keyword) ? 'flex' : 'none';
    });
}


// Update price and display payment info based on selected facility
function updatePrice() {
	const facility = document.getElementById('facility').value;
	const priceInfo = document.getElementById('priceInfo');
	priceInfo.style.display = facility === "Gymnasium" || facility === "Swimming Pool" ? "block" : "none";
}

// Handle form submission in booking page
function submitBooking() {
	event.preventDefault();
	
	const facility = document.getElementById('facility').value;
	const receipt = document.getElementById('receipt').files[0];

	if (!facility) {
		alert("Please select a facility.");
		return;
	}

	if (!receipt) {
		alert("Please upload your payment receipt.");
		return;
	}

	const confirmationMessage = document.getElementById('confirmationMessage');
	confirmationMessage.style.display = "block";

	document.getElementById('bookingForm').reset();
	document.getElementById('priceInfo').style.display = "none";
	document.getElementById('courtForm').style.display = "none";
	document.getElementById('courtPrice').textContent = "Price: RM 0";
	
	confirmationMessage.scrollIntoView({ behavior: "smooth" });
}

// Update booking form
function updateForm() {
	const facility = document.getElementById('facility').value;
	const priceInfo = document.getElementById('priceInfo');
	const courtForm = document.getElementById('courtForm');
	const courtPrice = document.getElementById('courtPrice');

	// Show specific form based on facility selection
	if (facility === "Gymnasium" || facility === "Swimming Pool") {
		priceInfo.style.display = "block";
		courtForm.style.display = "none";
	} else if (
		facility === "Squash Courts" || 
		facility === "Badminton Courts" || 
		facility === "Tennis Courts" || 
		facility === "Football Field"
	) {
		priceInfo.style.display = "none";
		courtForm.style.display = "block";

		// Update form elements for football field
		if (facility === "Football Field") {
			document.getElementById('numCourtsForm').style.display = "none"; // Hide number of courts for football field
		} else {
			document.getElementById('numCourtsForm').style.display = "block"; // Show number of courts for courts
		}

		// Recalculate price when hours, date, or time change
		const numHoursInput = document.getElementById('numHours');
		const courtDateInput = document.getElementById('courtDate');
		const courtTimeInput = document.getElementById('courtTime');

		numHoursInput.addEventListener('input', calculateCourtOrFieldPrice);
		courtDateInput.addEventListener('input', calculateCourtOrFieldPrice);
		courtTimeInput.addEventListener('input', calculateCourtOrFieldPrice);

		// Reset price initially
		courtPrice.textContent = "Price: RM 0";
	} else {
		priceInfo.style.display = "none";
		courtForm.style.display = "none";
	}
}

// Calculate price for booking
function calculateCourtOrFieldPrice() {
    const facility = document.getElementById('facility').value;
    const numHours = parseInt(document.getElementById('numHours').value) || 0;
    const courtDate = new Date(document.getElementById('courtDate').value);
    const courtTime = document.getElementById('courtTime').value;

    if (!courtDate || !courtTime) {
        document.getElementById('courtPrice').textContent = "Price: RM 0";
        return;
    }

    const day = courtDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    const time = parseInt(courtTime.split(":")[0]); // Extract the hour (24-hour format)

    let basePrice = 0;
    let discount = 0;

    // Determine base price
    if (facility === "Football Field") {
        basePrice = numHours * 150; // RM 150 per hour
    } else {
        const numCourts = parseInt(document.getElementById('numCourts').value) || 0;
        basePrice = numCourts * numHours * 6; // RM 6 per hour per court
    }

    // Apply discounts based on "crazy hours"
    if (
        (day >= 1 && day <= 5 && time >= 8 && time < 10) || // Mon-Fri, 8am-10am
        ((day === 0 || day === 6) && (time === 0 || time === 1)) // Sat-Sun, 12am-2am
    ) {
        discount = (day >= 1 && day <= 5) ? 0.2 : 0.3; // 20% for weekdays, 30% for weekends
        basePrice -= basePrice * discount;
    }

    const discountText = discount > 0 
        ? ` (Discount Applied: ${discount * 100}% Off)` 
        : "";

    document.getElementById('courtPrice').textContent = `Price: RM ${basePrice.toFixed(2)}${discountText}`;
}

// Show message after user submit message in contact form
function receiveForm() {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Capture form data (optional: for debugging or further processing)
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Log form data to the console (optional)
    console.log("Form Data Submitted:");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);

    // Show success message
    const successMessage = document.getElementById("successMessage");
    successMessage.style.display = "block";

    // Scroll to the success message
    successMessage.scrollIntoView({ behavior: "smooth" });

    // Reset the form fields
    document.getElementById("contactForm").reset();

    // Optional: Hide the success message after 5 seconds
    setTimeout(() => {
        successMessage.style.display = "none";
    }, 5000);
}

