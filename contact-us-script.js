(function () {
	const form = document.getElementById("contactForm");
	const alertEl = document.getElementById("submitAlert");

	form.addEventListener("submit", function (e) {
		e.preventDefault();
		e.stopPropagation();

		if (!form.checkValidity()) {
			form.classList.add("was-validated");
			return;
		}

		// simulate submit action
		alertEl.classList.remove("d-none");
		form.reset();
		form.classList.remove("was-validated");

		// Optional: hide the alert after a few seconds
		setTimeout(() => alertEl.classList.add("d-none"), 4000);
	});
})();
