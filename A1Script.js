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