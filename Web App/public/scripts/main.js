var rhit = rhit || {};

/** PATIENT COLLECTION **/
rhit.COLLECTION_PATIENTS = "patients";
rhit.PATIENT_ADDRESS = "address";
rhit.PATIENT_BIRTHDATE = "birthdate";
rhit.PATIENT_BLOOD_PRESSURE = "bloodPressure";
rhit.PATIENT_FIRSTNAME = "firstName";
rhit.PATIENT_GOOGLE_ID = "googleID";
rhit.PATIENT_HEIGHT = "height";
rhit.PATIENT_LASTNAME = "lastName";
rhit.PATIENT_LAST_ONLINE = "lastOnline";
rhit.PATIENT_PRIMARY_PROVIDER = "primaryProvider";
rhit.PATIENT_PULSE = "pulse";
rhit.PATIENT_SPO2 = "spo2";
rhit.PATIENT_TEMPERATURE = "temperature";
rhit.PATIENT_WEIGHT = "weight";

/** MEDICINES **/
rhit.MEDICINE_DOSAGE = "dosage"
rhit.MEDICINE_NAME = "name"
rhit.MEDICINE_PRIMARY_PROVIDER = "primaryProvider"
rhit.MEDICINE_ISVALID = "isValid"
rhit.MEDICINE_LAST_TOUCHED = "lastTouched"

rhit.single_AuthManager = null;
rhit.single_PatientsManager = null;
rhit.single_SinglePatientsManager = null;


/** PAGE CONTROLLERS **/

// Login Page Controller
/**
 * PURPOSE: Handle all View and Controller interactions for the Patients Page
 */
rhit.LoginPageController = class {
	constructor() {
		// * Click Listener for Login Button
		document.querySelector("#loginButton").onclick = (event) => {
			rhit.single_AuthManager.signIn();
		};

		// * Handles Login on Press of the Enter Key
		document.querySelector('#passwordInput').addEventListener("keyup", (event) => {
			if (event.keyCode === 13) { // 13 is the keyCode for Enter
				event.preventDefault();
				document.querySelector('#loginButton').click();
			}
		})
	}
}

// Patients Page Controller
/**
 * PURPOSE: Handle all View and Controller interactions for the Patients Page
 */
rhit.PatientsPageController = class {
	constructor() {
		// * Click Listener for sign out on Patients Page
		document.querySelector("#signOutLink").onclick = (event) => {
			rhit.single_AuthManager.signOut();
		};

		rhit.single_PatientsManager.beginListening(this.updateList.bind(this));
		rhit.single_PatientsManager.add();
	}

	updateList() {
		const newList = htmlToElement('<div id="patientsCards"></div>');
		for (let i = 0; i < rhit.single_PatientsManager.length; i++) {
			const patient = rhit.single_PatientsManager.getPatientAtIndex(i);
			const newCard = this._createCard(patient);
			newList.appendChild(newCard);
		}

		const oldList = document.querySelector("#patientsCards");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}

	_createCard(patient) {
		return htmlToElement(`<div class="card">
        						<div class="card-body">
        							<div class="patientsCardInfo">
            							<h4>${patient.lastName}, ${patient.firstName}</h4>
            							<p>Primary Provider: ${patient.primaryProvider}</p>
          							</div>
          							<div class="patientsCardInfo">
            							<p>Last online: ${this._parseDate(patient.lastOnline)}</p>
            							<button id="selectButton" class="btn btn-primary" type="button">Select</button>
          							</div>
        						</div>
      						</div>`);
	}

	_parseDate(timestamp) {
		const date = timestamp.toDate()
		return `${date.getMonth()}/${date.getDate()}/${date.getYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
	}
}

// Single Patients Page Controller
/**
 * PURPOSE: Handle all View and Controller interactions for the Single Patients Page
 */
rhit.SinglePatientPageController = class {
	constructor() {

		const vitalsButton = document.querySelector("#vitalsButton");
		const medicinesButton = document.querySelector("#medicinesButton");
		const notesButton = document.querySelector("#notesButton");

		const vitalsCard = document.querySelector("#vitalsCard");
		const medicinesCard = document.querySelector("#medicinesCard");
		const notesCard = document.querySelector("#notesCard");

		// When a user clicks any of the buttons from the button group
		// (VITALS, MEDICINES, NOTES), the cards need to change as well
		// as the active class on the buttons
		vitalsButton.onclick = (event) => {
			vitalsButton.classList.add("active");
			medicinesButton.classList.remove("active");
			notesButton.classList.remove("active");

			vitalsCard.classList.remove("hidden");
			medicinesCard.classList.add("hidden");
			notesCard.classList.add("hidden");

		};

		medicinesButton.onclick = (event) => {
			medicinesButton.classList.add("active");
			vitalsButton.classList.remove("active");
			notesButton.classList.remove("active");

			medicinesCard.classList.remove("hidden");
			vitalsCard.classList.add("hidden");
			notesCard.classList.add("hidden");

		};

		notesButton.onclick = (event) => {
			notesButton.classList.add("active");
			medicinesButton.classList.remove("active");
			vitalsButton.classList.remove("active");

			notesCard.classList.remove("hidden");
			medicinesCard.classList.add("hidden");
			vitalsCard.classList.add("hidden");
		};

	}
}


/** MANAGERS **/

// Auth Manager
/**
 * PURPOSE: Handle all Authentification (creation, deleting, searching for current users)
 * [USERS ARE HEALTHCARE PROFESSIONALS]
 */
rhit.AuthManager = class {
	constructor() {
		this._user = null;
	}

	// * Listens for a change in authorization and displays user info in console
	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			if (user) {
				// const displayName = user.displayName;
				const email = user.email;
				// const photoURL = user.photoURL;
				// const phoneNumber = user.phoneNumber;
				const uid = user.uid;

				console.log("The user is signed in ", uid);
				// console.log('displayName :>> ', displayName);
				console.log('email :>> ', email);
				// console.log('photoURL :>> ', photoURL);
				// console.log('phoneNumber :>> ', phoneNumber);
				console.log('uid :>> ', uid);
			} else {
				console.log("There is no user signed in!");
			}
			changeListener();
		});
	}

	// * Handles Sign with Email and Password using Firebase
	signIn() {
		const inputEmailEl = document.querySelector("#logonInput");
		const inputPasswordEl = document.querySelector("#passwordInput");

		console.log(`Log in for email: ${inputEmailEl.value} password: ${inputPasswordEl.value}`);
		firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch(function (error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log("Existing account log in error", errorCode, errorMessage);
		});
	}

	// * Handles Sign Out using Firebase
	signOut() {
		firebase.auth().signOut().catch((error) => {
			console.log("Sign out error");
		});
	}

	// * Checks if there is currently a user signed
	get isSignedIn() {
		return !!this._user;
	}

	// * Gets the current user's id
	get uid() {
		return this._user.uid;
	}
}

// Patients Manager
/**
 * PURPOSE: Handles a Patient Document [NOT A HEALTHCARE PROFESSIONAL]
 */
rhit.PatientsManager = class {
	constructor(uid) {
		this.uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.COLLECTION_PATIENTS);
		this._unsubscribe = null;
	}

	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.PATIENT_LAST_ONLINE, "desc");
		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			console.log("Patient Update!");
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}

	stopListening() {
		this._unsubscribe();
	}

	add() {
		console.log("Added a new Patient");

		this._ref.add({
				[rhit.PATIENT_ADDRESS]: "address",
				[rhit.PATIENT_BIRTHDATE]: "birthdate",
				[rhit.PATIENT_BLOOD_PRESSURE]: {},
				[rhit.PATIENT_FIRSTNAME]: "Nathan",
				[rhit.PATIENT_GOOGLE_ID]: "googleID",
				[rhit.PATIENT_HEIGHT]: {},
				[rhit.PATIENT_LASTNAME]: "Prescot",
				[rhit.PATIENT_LAST_ONLINE]: firebase.firestore.Timestamp.now(),
				[rhit.PATIENT_PRIMARY_PROVIDER]: "primaryProvider",
				[rhit.PATIENT_PULSE]: {},
				[rhit.PATIENT_SPO2]: {},
				[rhit.PATIENT_TEMPERATURE]: {},
				[rhit.PATIENT_WEIGHT]: {},
			})
			.then(function (docRef) {
				console.log(`Document written: ${docRef.id}`);
				rhit.single_PatientsManager.createMedicines(docRef.id);
			})
			.catch(function (error) {
				console.log("Error adding document: ", error);
			});
	}

	get length() {
		return this._documentSnapshots.length;
	}

	getPatientAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const patient = new rhit.Patient(docSnapshot.id,
			docSnapshot.get(rhit.PATIENT_ADDRESS),
			docSnapshot.get(rhit.PATIENT_BIRTHDATE),
			docSnapshot.get(rhit.PATIENT_BLOOD_PRESSURE),
			docSnapshot.get(rhit.PATIENT_FIRSTNAME),
			docSnapshot.get(rhit.PATIENT_GOOGLE_ID),
			docSnapshot.get(rhit.PATIENT_HEIGHT),
			docSnapshot.get(rhit.PATIENT_LASTNAME),
			docSnapshot.get(rhit.PATIENT_LAST_ONLINE),
			docSnapshot.get(rhit.PATIENT_PRIMARY_PROVIDER),
			docSnapshot.get(rhit.PATIENT_PULSE),
			docSnapshot.get(rhit.PATIENT_SPO2),
			docSnapshot.get(rhit.PATIENT_TEMPERATURE),
			docSnapshot.get(rhit.PATIENT_WEIGHT)
		);
		return patient;
	}

	createMedicines(id) {
		this._ref.doc(`${id}`).collection('medicines').add({
			[rhit.PATIENT_ADDRESS]: "address",
			[rhit.MEDICINE_DOSAGE]: "dosage",
			[rhit.MEDICINE_NAME]: "name",
			[rhit.MEDICINE_PRIMARY_PROVIDER]: "primaryProvider",
			[rhit.MEDICINE_ISVALID]: "isValid", 
			[rhit.MEDICINE_LAST_TOUCHED]:firebase.firestore.Timestamp.now(),
		})
		.then(function () {
			console.log(`Document created in Medicines Collection`);
			})
			.catch(function (error) {
				console.log("Error adding document: ", error);
			});
	}
}

// Single Patients Manager
/**
 * PURPOSE: Handles a Single Patient Information
 */
rhit.SinglePatientManager = class {
	constructor(uid) {}
}


/** DATA MANAGEMENT **/

// Patient Wrapper
/**
 * PURPOSE: Holds all data relevant to a given patient
 */
rhit.Patient = class {
	constructor(id, address, birthdate, bloodPressure, firstName, googleID,
		height, lastName, lastOnline, primaryProvider, pulse,
		spo2, temperature, weight) {
		this.id = id;
		this.address = address;
		this.birthdate = birthdate;
		this.bloodPressure = bloodPressure;
		this.firstName = firstName;
		this.googleID = googleID;
		this.height = height;
		this.lastName = lastName;
		this.lastOnline = lastOnline;
		this.primaryProvider = primaryProvider;
		this.pulse = pulse;
		this.spo2 = spo2;
		this.temperature = temperature;
		this.weight = weight;
	}
}

/** PAGE MANAGEMENT **/

// Redirects
/**
 * PURPOSE: Checking for Redirects is mainly only for when a user first logs in
 * Or is already logged in
 * 
 */
rhit.checkForRedirects = () => {
	// * Checks whether the user is logged in an redirects the page accordingly
	if (document.querySelector("#loginPage") && rhit.single_AuthManager.isSignedIn) {
		window.location.href = "/patients.html";
	}
	if (!document.querySelector("#loginPage") && !rhit.single_AuthManager.isSignedIn) {
		window.location.href = "/";
	}
};


// Page Initialization
/**
 * PURPOSE: Page Initialization takes place here. Depending what page a user is on
 * will direct the user to the correct webpag
 * 
 */
rhit.initializePage = () => {
	const urlParams = new URLSearchParams(window.location.search);
	// * initializes page controller for Login Page
	if (document.querySelector("#loginPage")) {
		console.log("You are on the login page.");
		new rhit.LoginPageController();
	}

	// * initializes page controller for Patients Page
	if (document.querySelector("#patientsPage")) {
		console.log("You are on the patients page.");
		rhit.single_PatientsManager = new rhit.PatientsManager();
		new rhit.PatientsPageController();
	}

	// * initializes page controller for Patients Page
	if (document.querySelector("#singlePatientPage")) {
		console.log("You are on the single patient page.");
		rhit.single_SinglePatientsManager = new rhit.SinglePatientManager();
		new rhit.SinglePatientPageController();
	}

};

// Page Status
/**
 * PURPOSE: Serves as method that gets called upon logging in/logging out
 * 
 */
rhit.pageStatus = function () {
	console.log(`The auth state has changed. isSignedIn = ${rhit.single_AuthManager.isSignedIn}`);

	// Check for redirects 
	rhit.checkForRedirects();

	// Page initialization
	rhit.initializePage();
}

/** MAIN **/
rhit.main = function () {
	rhit.single_AuthManager = new rhit.AuthManager();
	rhit.single_AuthManager.beginListening(rhit.pageStatus.bind(this));
};

rhit.main();



/**
 * * TOOLS
 */
// From: https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}