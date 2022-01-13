var rhit = rhit || {};

rhit.FB_COLLECTION_USERS = "users";
rhit.FB_KEY_PATIENT_FIRSTNAME = "firstName";
rhit.FB_KEY_PATIENT_LASTNAME = "lastName";
rhit.FB_KEY_PATIENT_GOOGLE_ID = "GoogleID";
rhit.FB_KEY_PATIENT_PRIMARY_PROVIDER = "primaryProvider";
rhit.FB_KEY_PATIENT_LAST_ONLINE = "lastOnline";

rhit.fbAuthManager = null;
rhit.fbPatientsManager = null;


/**
 * * PAGE CONTROLLERS
 */
rhit.LoginPageController = class {
	constructor() {
		// * Click Listener for Login Button
		document.querySelector("#loginButton").onclick = (event) => {
			rhit.fbAuthManager.signIn();
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

rhit.PatientsPageController = class {
	constructor() {
		// * Click Listener for sign out on Patients Page
		document.querySelector("#signOutLink").onclick = (event) => {
			rhit.fbAuthManager.signOut();
		};

		rhit.fbPatientsManager.beginListening(this.updateList.bind(this));
	}

	updateList() {
		const newList = htmlToElement('<div id="patientsCards"></div>');
		for (let i = 0; i < rhit.fbPatientsManager.length; i++) {
			const patient = rhit.fbPatientsManager.getPatientAtIndex(i);
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


/**
 * * DATA MANAGEMENT
 */

// * PATIENT MANAGEMENT

rhit.Patient = class {
	constructor(id, firstName, lastName, googleId, primaryProvider, lastOnline) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.googleId = googleId;
		this.primaryProvider = primaryProvider;
		this.lastOnline = lastOnline;
	}
}

rhit.FbPatientsManager = class {
	constructor(uid) {
		this.uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_USERS);
		this._unsubscribe = null;
	}

	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.FB_KEY_PATIENT_LAST_ONLINE, "desc");
		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			console.log("Patient Update!");
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}

	stopListening() {
		this._unsubscribe();
	}

	get length() {
		return this._documentSnapshots.length;
	}

	getPatientAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const patient = new rhit.Patient(docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_PATIENT_FIRSTNAME),
			docSnapshot.get(rhit.FB_KEY_PATIENT_LASTNAME),
			docSnapshot.get(rhit.FB_KEY_PATIENT_GOOGLE_ID),
			docSnapshot.get(rhit.FB_KEY_PATIENT_PRIMARY_PROVIDER),
			docSnapshot.get(rhit.FB_KEY_PATIENT_LAST_ONLINE)
		);
		return patient;
	}
}


/**
 * * AUTHENTICATION
 */
rhit.FbAuthManager = class {
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


/**
 * * PAGE MANAGEMENT
 */
rhit.checkForRedirects = () => {
	// * Checks whether the user is logged in an redirects the page accordingly
	if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/patients.html";
	}
	if (!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/";
	}
};

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
		rhit.fbPatientsManager = new rhit.FbPatientsManager();
		new rhit.PatientsPageController();
	}
};


/**
 * * MAIN
 */
rhit.main = function () {
	console.log("Ready");

	// * Initializes webpage
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		console.log("isSignedIn = ", rhit.fbAuthManager.isSignedIn);
		rhit.checkForRedirects();
		rhit.initializePage();
	});
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