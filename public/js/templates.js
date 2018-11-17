$(document).ready(function(){
  M.AutoInit();

   //template loading functions
   const loadQuote = () => { $("#main").load("./templates/quote.html") }
   const loadAbout = () => { $("#main").load("./templates/about.html") }
   const loadContact = () => { $("#main").load("./templates/contact.html") }
   const loadAuth = () => { $("#main").load("./templates/auth.html") }
   
   // top nav loading functions
   $(document).on("click", "#top-nav-work", () => {loadQuote()});
   $(document).on("click", "#top-nav-about", () => {loadAbout()});
   $(document).on("click", "#top-nav-contact", () => {loadContact()});
   $(document).on("click", "#top-nav-work", () => {loadAuth()});
   
   // bottom nav loading functions
   $(document).on("click", "#bottom-nav-work", () => {loadQuote()});
   $(document).on("click", "#bottom-nav-about", () => {loadAbout()});
   $(document).on("click", "#bottom-nav-contact", () => {loadContact()});
   $(document).on("click", "#bottom-nav-work", () => {loadAuth()});

	//displayQuoteTemplate('#calculator');  //getting displayQuoteTemplate is undefined error

	$(document).on("click", "#btnQuoteMe", function() {
		// before loading the estimate template validate user input
		// variables store user address information
		let address = $('#txtAddress').val().trim();
		let firstName = $('#txtFirstName').val().trim();
		let lastName = $('#txtLastName').val().trim();
		let phone = $('#txtPhone').val().trim();
		let email = $('#txtEmail').val().trim();

		console.log(window.car);
		$.post("/api/quote", {
			info: car.info.quartsCapacity
		}).then(function(response) {
			console.log(response);
			if(!car.make || !car.year || !car.model) {
				showErrMessage("You must select your car make/year/model");
			}
			// check if user has selected a service
			else if (!car.services) {
				showErrMessage("You must select a service")
			}
			// check if user has entered a valid address
			else if(breakAddress(address) === false) {
				showErrMessage("You must enter your adress");
			}
			// if everything passes...
			else {
				car.address = breakAddress(address);
					// load  estimate
				car.customer = {
					firstName: firstName,
					lastName: lastName,
					phone: phone,
					email: email,
					address: breakAddress(address),
					quoteId: response.id
				}
				$("#main").load('templates/estimate.html', function() {
					$('#carInfo').text(`${car.year} ${car.make} ${car.model}`);
					$('#oilType').text(car.info.oilType);
					$('#oilCapacity').text(car.info.quartsCapacity);
					$('#totalCost').text(response.quoteAmt);
				});
			}
		});
	});

	$(document).on("click", "#btnBook", function() {
		// when user clicks schedule appointment load appointment template
		// add a save for later button
		$("#calculator").load("templates/appointment.html", function () {
			M.AutoInit();
		});
	});

	$(document).on("click", "#btnPay", function() {
		// when user clicks the appointment verify every field and payment information
		// when the user has verified their dates
		// send the car information to server
		// make work order on server and let them enter pay information
		let date = $('#txtDate').val().trim();
		let time = $('#txtTime').val().trim();
		let appointment = {
			date: date,
			time: time
		}
		if(!date || !time) {
			showErrMessage("Please select a day and a time");
		} else {
			car.appointment = appointment;
			// send information to server
			// when response
			// $("#main").load("templates/workorder.html");
		}
	})

	$(document).on("click", "#registerBtn", function(event) {
		event.preventDefault();
		let newUser = {
			fName: $("#fName").val().trim(),
			lName: $("#lName").val().trim(),
			email: $("#emailReg").val().trim(),
			phone: $("#phone").val().trim(),
			// areaCode: $("#areaCode").val().trim(),
			password: $("#passwordReg").val().trim(),
			// picture: $("#picture").src()
		}
		console.log(newUser);

		$.post("/api/register", newUser).then(function(response) {
			// console.log(response);
		});

		$("#fName").val("");
		$("#lName").val("");
		$("#emailReg").val("");
		$("#phone").val("");
		$("#txtAddress").val("");
		$("#areaCode").val("");
		$("#passwordReg").val("");
		$("#pwConfirm").val("");
		// $("#picture").src("");
		 
	});

});