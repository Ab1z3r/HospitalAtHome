var rhit = rhit || {};

/** PRIMARY PROVIDER COLLECTION **/
rhit.COLLECTION_PRIMARY_PROVIDERS = "primaryProviders";
rhit.PROVIDER_FIRST_NAME = "firstName";
rhit.PROVIDER_LAST_NAME = "lastName";
rhit.PROVIDER_PATIENTS = "patients";
rhit.PROVIDER_UID = "uid";

/** PATIENT COLLECTION **/
rhit.COLLECTION_PATIENTS = "patients";
rhit.PATIENT_ADDRESS = "address";
rhit.PATIENT_BIRTHDATE = "birthdate";
rhit.PATIENT_BLOOD_PRESSURE = "bloodPressure";
rhit.PATIENT_FIRST_NAME = "firstName";
rhit.PATIENT_GOOGLE_ID = "googleID";
rhit.PATIENT_HEIGHT = "height";
rhit.PATIENT_LAST_NAME = "lastName";
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

/** NOTES **/
rhit.NOTE_CREATED_BY = "createdBy"
rhit.NOTE_LAST_TOUCHED = "lastTouched"
rhit.NOTE_NOTE = "note"

rhit.single_AuthManager = null;
rhit.single_PrimaryProviderManager = null;
rhit.single_PatientsManager = null;
rhit.single_SinglePatientManager = null;

rhit.single_MedicinesManager = null;
rhit.single_NotesManager = null;


/** PAGE CONTROLLERS **/
// Login Page Controller
/**
 * PURPOSE: Handle all View and Controller interactions for the Login Page
 */
rhit.LoginPageController = class {
	constructor() {
		const inputEmailEl = document.querySelector("#logonInput");
		const inputPasswordEl = document.querySelector("#passwordInput");

		// * Click Listener for Login Button
		document.querySelector("#loginButton").onclick = (event) => {
			rhit.single_AuthManager.signIn(inputEmailEl, inputPasswordEl);
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

/** PAGE CONTROLLERS **/
// Signup Page Controller
/**
 * PURPOSE: Handle all View and Controller interactions for the Signup Page
 */
rhit.SignupPageController = class {
	constructor() {
		let emailInput = document.querySelector("#logonInput");
		let passwordInput = document.querySelector("#passwordInput");
		let nameInput = document.querySelector("#nameInput");

		document.querySelector("#signupButton").onclick = (event) => {
			rhit.single_AuthManager.signUp(emailInput, passwordInput, nameInput);
		};

		rhit.single_PrimaryProviderManager.beginListeningForCollection();
	}

}

// Patients Page Controller
/**
 * PURPOSE: Handle all View and Controller interactions for the Patients Page
 */
rhit.PatientsPageController = class {
	constructor() {
		let pressedBack = false;
		const searchInput = document.querySelector("#patientSearchInput");
		const patientSelect = document.querySelector("#patientsSelect");

		// * Click Listener for sign out on Patients Page
		document.querySelector("#signOutLink").onclick = (event) => {
			rhit.single_AuthManager.signOut();
			window.location.href = "/";
		};

		document.querySelector("#patientsSearchButton").onclick = (event) => {
			rhit.single_PatientsManager.search(searchInput.value, this.updateList.bind(this));
		};

		// * Handles filtering of Patients
		patientSelect.addEventListener('change', (event) => {
			if (patientSelect.value == "Last Online") {
				rhit.single_PatientsManager.beginListening(this.updateList.bind(this), rhit.PATIENT_LAST_ONLINE, "desc");

			} else if (patientSelect.value == "My patients") {
				rhit.single_PatientsManager.repopulate(this.updateList.bind(this), "patients");

			} else if (patientSelect.value == "First Name") {
				rhit.single_PatientsManager.beginListening(this.updateList.bind(this), rhit.PATIENT_FIRST_NAME, "asc");

			} else if (patientSelect.value == "Last Name") {
				rhit.single_PatientsManager.beginListening(this.updateList.bind(this), rhit.PATIENT_LAST_NAME, "asc");
			}
		});


		// * Handles Searching for a Patient
		searchInput.addEventListener("keyup", (event) => {
			if (event.keyCode === 8) { // 8 is the keyCode for Backspace
				event.preventDefault();
				if (searchInput.value.length == 0) {
					rhit.single_PatientsManager.beginListening(this.updateList.bind(this), rhit.PATIENT_LAST_ONLINE, "desc");
				} else if (!pressedBack && !/\s/.test(searchInput.value)) {
					rhit.single_PatientsManager.repopulate(this.updateList.bind(this), "name", searchInput.value);
					rhit.single_PatientsManager.search(searchInput.value, this.updateList.bind(this));
					pressedBack = true;
				} else {
					rhit.single_PatientsManager.search(searchInput.value, this.updateList.bind(this));
				}
			} else {
				rhit.single_PatientsManager.search(searchInput.value, this.updateList.bind(this));
				pressedBack = false;
			}
		})

		rhit.single_PatientsManager.beginListening(this.updateList.bind(this), rhit.PATIENT_LAST_ONLINE);
		rhit.single_PrimaryProviderManager.beginListenForDocument();
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

		// * Adds listener to the select button in each patient card in the patients list
		const selectButtons = document.querySelectorAll("#selectButton");
		for (const sel of selectButtons) {
			sel.addEventListener("click", (event) => {
				window.location.href = `/single_patient.html?uid=${rhit.single_AuthManager.uid}&id=${sel.dataset.id}`;
			})
		}
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
            							<button data-id=${patient.id} id="selectButton" class="btn btn-primary" type="button">Select</button>
          							</div>
        						</div>
      						</div>`);
	}

	_parseDate(timestamp) {
		const date = timestamp.toDate()
		const year = date.getYear().toString()
		return `${date.getMonth()+1}/${date.getDate()}/20${year.substring(1,3)} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
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

		// * Click Listener for sign out on Single Patient Page
		document.querySelector("#signOutLink").onclick = (event) => {
			rhit.single_AuthManager.signOut();
			window.location.href = "/";
		};

		// * Click Listener for Bread Crumbs
		document.querySelector("#patientsBreadCrumb").onclick = (event) => {
			window.location.href = `/patients.html?uid=${rhit.single_AuthManager.uid}`;
		};

		// * Redirects to Graphics Page
		document.querySelector("#weightData").onclick = (event) => {
			window.location.href = `graphics.html?id=${rhit.single_SinglePatientManager.id}&vital=Weight`;
		};

		document.querySelector("#spo2Data").onclick = (event) => {
			window.location.href = `/graphics.html?id=${rhit.single_SinglePatientManager.id}&vital=SPO2`;
		};

		document.querySelector("#bloodPressureData").onclick = (event) => {
			window.location.href = `/graphics.html?id=${rhit.single_SinglePatientManager.id}&vital=Blood Pressure`;
		};

		document.querySelector("#heightData").onclick = (event) => {
			window.location.href = `/graphics.html?id=${rhit.single_SinglePatientManager.id}&vital=Height`;
		};

		document.querySelector("#pulseData").onclick = (event) => {
			window.location.href = `/graphics.html?id=${rhit.single_SinglePatientManager.id}&vital=Pulse`;
		};

		document.querySelector("#temperatureData").onclick = (event) => {
			window.location.href = `/graphics.html?id=${rhit.single_SinglePatientManager.id}&vital=Temperature`;
		};


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

		rhit.single_MedicinesManager.beginListening();
		rhit.single_NotesManager.beginListening();
		rhit.single_SinglePatientManager.beginListening(this.updateView.bind(this));

	}

	updateView() {
		document.querySelector("#singlePatientHeader").innerHTML = `${rhit.single_SinglePatientManager.lastName}, ${rhit.single_SinglePatientManager.firstName}`
		document.querySelector("#singlePatientBreadCrumb").innerHTML = `${rhit.single_SinglePatientManager.lastName}, ${rhit.single_SinglePatientManager.firstName}`.toUpperCase()
		document.querySelector("#singlePatientTitle").innerHTML = `${rhit.single_SinglePatientManager.lastName}, ${rhit.single_SinglePatientManager.firstName}`

		this.updateCardsView();
	}

	updateCardsView() {
		const singlePatient = rhit.single_SinglePatientManager.getPatient()

		// VITALS CARD
		document.querySelector("#weightData").innerHTML = `Weight: ${singlePatient.weight.values().next().value} lbs`;
		document.querySelector("#spo2Data").innerHTML = `SPO2: ${singlePatient.spo2.values().next().value} %`;
		document.querySelector("#bloodPressureData").innerHTML = `Blood Pressure: ${singlePatient.bloodPressure.values().next().value} mmHg`;
		document.querySelector("#heightData").innerHTML = `Height: ${singlePatient.height.values().next().value} in`;
		document.querySelector("#pulseData").innerHTML = `Pulse: ${singlePatient.pulse.values().next().value} bpm`;
		document.querySelector("#temperatureData").innerHTML = `Temperature: ${singlePatient.temperature.values().next().value} \xB0`;

		// MEDICINE CARD
		const medList = htmlToElement('<div id="medicinesInfo"></div>');
		for (let i = 0; i < rhit.single_MedicinesManager.length; i++) {
			const medicine = rhit.single_MedicinesManager.getMedicineAtIndex(i);
			const newCard = this._createMedicineCard(medicine);
			medList.appendChild(newCard);
		}

		const oldMedList = document.querySelector("#medicinesInfo");
		oldMedList.removeAttribute("id");
		oldMedList.hidden = true;
		oldMedList.parentElement.appendChild(medList);

		// NOTE CARD
		const noteList = htmlToElement('<div id="notesInfo"></div>');
		for (let i = 0; i < rhit.single_NotesManager.length; i++) {
			const note = rhit.single_NotesManager.getNoteAtIndex(i);
			const newCard = this._createNoteCard(note);
			noteList.appendChild(newCard);
		}

		const oldNoteList = document.querySelector("#notesInfo");
		oldNoteList.removeAttribute("id");
		oldNoteList.hidden = true;
		oldNoteList.parentElement.appendChild(noteList);

	}

	_createMedicineCard(medicine) {
		return htmlToElement(`<div class="medicationCard card">
		<div class="medicationCardBody card-body">
		  <div class="medicationCardInfo">
			<p class="medicationName">${medicine.name}</p>
			<p>Dosage: ${medicine.dosage}</p>
		  </div>
		</div>
	  </div>>`);
	}

	_createNoteCard(note) {
		return htmlToElement(`<div class="specificNoteCard card">
		<div class="specificNoteCardBody card-body">
		  <div class="specificNoteCardInfo">
			<p>${note.note}</p>
			<p class="noteData">${this._parseDate(note.lastTouched)}</p>
		  </div>
		</div>
	  </div>`);
	}

	_parseDate(timestamp) {
		const date = timestamp.toDate()
		const year = date.getYear().toString()
		return `${date.getMonth()+1}/${date.getDate()}/20${year.substring(1,3)} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
	}

}

// Graphics Page Controller
/**
 * PURPOSE: Handle all View and Controller interactions for the Graphics Page
 */
rhit.GraphicsPageController = class {
	constructor(vital) {
		this._vital = vital
		// * Click Listener for sign out on Single Patient Page
		document.querySelector("#signOutLink").onclick = (event) => {
			rhit.single_AuthManager.signOut();
			window.location.href = "/";
		};

		// * Click Listener for Bread Crumbs
		document.querySelector("#patientsBreadCrumb").onclick = (event) => {
			window.location.href = `/patients.html?uid=${rhit.single_AuthManager.uid}`;
		};

		document.querySelector("#singlePatientBreadCrumb").onclick = (event) => {
			window.location.href = `/single_patient.html?uid=${rhit.single_AuthManager.uid}&id=${rhit.single_SinglePatientManager.id}`;
		};
		rhit.single_SinglePatientManager.beginListening(this.constructPage.bind(this));
	}

	constructPage() {
		this.updateView(this._vital)
		google.charts.setOnLoadCallback(drawChart(this._vital));
		this.retrieveHistory()
	}

	updateView(vital) {
		document.querySelector("#graphicsTitle").innerHTML = `${vital} History`
		document.querySelector("#graphicsHeader").innerHTML = `${vital}`
		document.querySelector("#singlePatientBreadCrumb").innerHTML = `<a>${rhit.single_SinglePatientManager.lastName}, ${rhit.single_SinglePatientManager.firstName}</a>`.toUpperCase()
		document.querySelector("#vitalBreadCrumb").innerHTML = `${vital}`.toUpperCase()
	}

	retrieveHistory() {
		const singlePatient = rhit.single_SinglePatientManager.getPatient()
		let vital;
		switch (this._vital) {
			case "Weight":
				vital = singlePatient.weight;
				break;
			case "SPO2":
				vital = singlePatient.spo2;
				break;
			case "Blood Pressure":
				vital = singlePatient.bloodPressure;
				break;
			case "Height":
				vital = singlePatient.height;
				break;
			case "Pulse":
				vital = singlePatient.pulse;
				break;
			case "Temperature":
				vital = singlePatient.temperature;
				break;
			default:
		}

		const historyList = htmlToElement('<div id="graphicsInfo"></div>');
		for (const [key, value] of vital) {
			const newCard = this._createHistoryCard(key, value);
			historyList.appendChild(newCard);
		}

		const oldHistoryList = document.querySelector("#graphicsInfo");
		oldHistoryList.removeAttribute("id");
		oldHistoryList.hidden = true;
		oldHistoryList.parentElement.appendChild(historyList);

	}
	_createHistoryCard(key, value) {
		let date = parseDate(key)
		return htmlToElement(`<div class="historyCard card">
		<div class="historyCardBody card-body">
		  <div class="historyCardInfo">
			<p>Data: ${value}</p>
			<p>Date: ${date.getMonth()}/${date.getDate()}/${date.getYear()}</p>
		  </div>
		</div>
	  </div>`);
	}
}


/** MANAGERS **/

// Auth Manager
/**
 * PURPOSE: Handle all Authentication (creation, deleting, searching for current users)
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
				const email = user.email;
				const uid = user.uid;

				console.log("The user is signed in ", uid);
				console.log('email :>> ', email);
				console.log('uid :>> ', uid);
				console.log('email verified :>>', user.emailVerified);

			} else {
				console.log("There is no user signed in!");
			}
			changeListener();
		});
	}

	// * Handles Sign with Email and Password using Firebase
	signIn(logonInput, passwordInput) {
		firebase.auth().signInWithEmailAndPassword(logonInput.value, passwordInput.value)
			.then(() => {
				// this.configureSignIn();
			}).catch(function (error) {
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

	// * Handles when a Primary Provider sign-ups new account
	signUp(emailInput, passwordInput, nameInput) {
		firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
			.then(() => {
				this.sendLink(nameInput);
			})
			.catch((error) => {
				const code = error.code;
				const errorMessage = error.message;
				console.log("Exisiting account log in error", code, errorMessage);
			});
	}

	sendLink(nameInput) {
		firebase.auth().currentUser.sendEmailVerification()
			.then(() => {
				console.log("Sending Email Verification!");
				const names = nameInput.value.split(" ");
				// TODO: Create Patient Document
				// Sign the Primary Provider Out
				// Return back to the Login Page after a certain amount time
				rhit.single_PrimaryProviderManager.add(names[0], names[1], rhit.single_AuthManager.uid);
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("Error:", errorCode, errorMessage);
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

	get isVerified() {
		return this._user.emailVerified;
	}
}

// Primary Provider Manager
/**
 * PURPOSE: Handles Primary Provider documents
 */
rhit.PrimaryProviderManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._document = {};
		this._ref = firebase.firestore().collection(rhit.COLLECTION_PRIMARY_PROVIDERS);
		this._unsubscribe = null;
	}

	beginListeningForCollection() {
		let query = this._ref;
		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
		});
	}

	beginListenForDocument() {
		this._unsubscribe = this._ref.doc(rhit.single_AuthManager.uid).onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Docoument exists!");
				this._document = doc;
			} else {
				console.log("Document does not exist!");
			}
		});

	}

	stopListening() {
		this._unsubscribe();
	}

	add(firstName, lastName, uid) {
		this._ref.doc(`${uid}`).set({
				[rhit.PROVIDER_FIRST_NAME]: firstName,
				[rhit.PROVIDER_LAST_NAME]: lastName,
				[rhit.PROVIDER_PATIENTS]: [],
			})
			.then(function (docRef) {
				// Sign the current user out and then return to login
				// TODO: Have Modal come up that user clicks first before returning
				rhit.single_AuthManager.signOut();
				window.location.href = "/";
			})
			.catch(function (error) {
				console.log("Error adding document: ", error);
			});
	}

	set documentSnapshots(queries) {
		this._documentSnapshots = queries;
	}

	get documentSnapshots() {
		return this.documentSnapshots;
	}

	get length() {
		return this._documentSnapshots.length;
	}

	getProvider() {
		const docSnapshot = this._document;
		const provider = new rhit.PrimaryProvider(
			docSnapshot.id,
			docSnapshot.get(rhit.PROVIDER_FIRST_NAME),
			docSnapshot.get(rhit.PROVIDER_LAST_NAME),
			docSnapshot.get(rhit.PROVIDER_PATIENTS),
		);
		return provider;
	}
	get lastName() {
		return this._document.get(rhit.PROVIDER_LAST_NAME);
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

	beginListening(changeListener, sortBy, direction) {
		let query = this._ref.orderBy(sortBy, direction);
		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}

	//** USED FOR SEARCHING / FILTERING DOCUMENTS
	repopulate(changeListener, searchBy, value = null) {
		let matched = [];
		if (searchBy == "name") {
			var names = value.split(" ");
			this._ref.where("firstName", "==", names[0])
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						matched.push(doc);
					});
					if (matched.length > 0) {
						this._documentSnapshots = matched;
						changeListener();
					}
				})
				.catch((error) => {
					console.log(`Error: ${error}`);
				});
		} else if (searchBy = "patients") {
			this._ref.where("primaryProvider", "==", rhit.single_PrimaryProviderManager.lastName)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						matched.push(doc);
					});
					if (matched.length > 0) {
						this._documentSnapshots = matched;
						changeListener();
					}
				})
				.catch((error) => {
					console.log(`Error: ${error}`);
				});
		}
	}

	stopListening() {
		this._unsubscribe();
	}

	add() {
		this._ref.add({
				[rhit.PATIENT_ADDRESS]: "address",
				[rhit.PATIENT_BIRTHDATE]: "birthdate",
				[rhit.PATIENT_BLOOD_PRESSURE]: {},
				[rhit.PATIENT_FIRST_NAME]: "Abby",
				[rhit.PATIENT_GOOGLE_ID]: "googleID",
				[rhit.PATIENT_HEIGHT]: {},
				[rhit.PATIENT_LAST_NAME]: "Holder",
				[rhit.PATIENT_LAST_ONLINE]: firebase.firestore.Timestamp.now(),
				[rhit.PATIENT_PRIMARY_PROVIDER]: "primaryProvider",
				[rhit.PATIENT_PULSE]: {},
				[rhit.PATIENT_SPO2]: {},
				[rhit.PATIENT_TEMPERATURE]: {},
				[rhit.PATIENT_WEIGHT]: {},
			})
			.then(function (docRef) {
				rhit.single_MedicinesManager.id = docRef.id;
				rhit.single_MedicinesManager.add();

				rhit.single_NotesManager.id = docRef.id;
				rhit.single_NotesManager.add();

			})
			.catch(function (error) {
				console.log("Error adding document: ", error);
			});
	}

	// ** FILTER THROUGH EXISTING DOCUMENT SNAPSHOTS
	// Make it where you can search/filter without needing to iterating
	search(value, changeListener) {
		// Code that iterates through without the need to reload from the firestore
		// Does not contain space (just first name)
		if (!/\s/.test(value)) {
			let matched = [];
			for (let i = 0; i < this.length; i++) {
				if (rhit.single_PatientsManager.getPatientAtIndex(i).firstName == value) {
					matched.push(this._documentSnapshots[i]);
				}
			}
			if (matched.length > 0) {
				this._documentSnapshots = matched;
			}
			changeListener();
		}

		// Does contain space (first and last name)
		else if (/\s/.test(value)) {
			let matched = [];
			var names = value.split(" ");
			for (let i = 0; i < this.length; i++) {
				if (rhit.single_PatientsManager.getPatientAtIndex(i).firstName == names[0] &&
					rhit.single_PatientsManager.getPatientAtIndex(i).lastName == names[1]) {
					matched.push(this._documentSnapshots[i]);
				}
			}
			if (matched.length > 0) {
				this._documentSnapshots = matched;
			}
			changeListener();
		}
	}

	getPatientAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const patient = new rhit.Patient(docSnapshot.id,
			docSnapshot.get(rhit.PATIENT_ADDRESS),
			docSnapshot.get(rhit.PATIENT_BIRTHDATE),
			docSnapshot.get(rhit.PATIENT_BLOOD_PRESSURE),
			docSnapshot.get(rhit.PATIENT_FIRST_NAME),
			docSnapshot.get(rhit.PATIENT_GOOGLE_ID),
			docSnapshot.get(rhit.PATIENT_HEIGHT),
			docSnapshot.get(rhit.PATIENT_LAST_NAME),
			docSnapshot.get(rhit.PATIENT_LAST_ONLINE),
			docSnapshot.get(rhit.PATIENT_PRIMARY_PROVIDER),
			docSnapshot.get(rhit.PATIENT_PULSE),
			docSnapshot.get(rhit.PATIENT_SPO2),
			docSnapshot.get(rhit.PATIENT_TEMPERATURE),
			docSnapshot.get(rhit.PATIENT_WEIGHT)
		);
		return patient;
	}

	set documentSnapshots(queries) {
		this._documentSnapshots = queries;
	}

	get documentSnapshots() {
		return this.documentSnapshots;
	}

	get length() {
		return this._documentSnapshots.length;
	}

}

// Single Patients Manager
/**
 * PURPOSE: Handles a Single Patient's Information
 */
rhit.SinglePatientManager = class {
	constructor(id) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.COLLECTION_PATIENTS).doc(id);
		this._id = id;
		this._vital = null;
	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Document data:", doc.data());
				this._documentSnapshot = doc;
				changeListener();
			} else {
				console.log("No such document!");
			}
		});
	}

	stopListening() {
		this._unsubscribe();
	}

	// TODO implement update and delete if needed

	update() {}

	delete() {}


	get id() {
		return this._id;
	}

	get address() {
		return this._documentSnapshot.get(rhit.PATIENT_ADDRESS);
	}

	get birthdate() {
		return this._documentSnapshot.get(rhit.PATIENT_BIRTHDATE);
	}

	get bloodPressure() {
		return this._documentSnapshot.get(rhit.PATIENT_BLOOD_PRESSURE);
	}

	get firstName() {
		return this._documentSnapshot.get(rhit.PATIENT_FIRST_NAME);
	}

	get googleID() {
		return this._documentSnapshot.get(rhit.PATIENT_GOOGLE_ID);
	}

	get height() {
		return this._documentSnapshot.get(rhit.PATIENT_HEIGHT);
	}

	get lastName() {
		return this._documentSnapshot.get(rhit.PATIENT_LAST_NAME);
	}

	get lastOnline() {
		return this._documentSnapshot.get(rhit.PATIENT_LAST_ONLINE);
	}

	get primaryProvider() {
		return this._documentSnapshot.get(rhit.PATIENT_PRIMARY_PROVIDER);
	}

	get pulse() {
		return this._documentSnapshot.get(rhit.PATIENT_PULSE);
	}

	get spo2() {
		return this._documentSnapshot.get(rhit.PATIENT_SPO2);
	}

	get temperature() {
		return this._documentSnapshot.get(rhit.PATIENT_TEMPERATURE);
	}

	get weight() {
		return this._documentSnapshot.get(rhit.PATIENT_WEIGHT);
	}

	get id() {
		return this._id;
	}

	getPatient() {
		const docSnapshot = this._documentSnapshot;
		const patient = new rhit.Patient(docSnapshot.id,
			docSnapshot.get(rhit.PATIENT_ADDRESS),
			docSnapshot.get(rhit.PATIENT_BIRTHDATE),
			docSnapshot.get(rhit.PATIENT_BLOOD_PRESSURE),
			docSnapshot.get(rhit.PATIENT_FIRST_NAME),
			docSnapshot.get(rhit.PATIENT_GOOGLE_ID),
			docSnapshot.get(rhit.PATIENT_HEIGHT),
			docSnapshot.get(rhit.PATIENT_LAST_NAME),
			docSnapshot.get(rhit.PATIENT_LAST_ONLINE),
			docSnapshot.get(rhit.PATIENT_PRIMARY_PROVIDER),
			docSnapshot.get(rhit.PATIENT_PULSE),
			docSnapshot.get(rhit.PATIENT_SPO2),
			docSnapshot.get(rhit.PATIENT_TEMPERATURE),
			docSnapshot.get(rhit.PATIENT_WEIGHT)
		);
		return patient;
	}

	get vital() {
		return this._vital
	}

	set vital(v) {
		this._vital = v;
	}
}

// Medicine Manager
/**
 * PURPOSE: Handles a Single Patient's Medicine Information
 */
rhit.MedicinesManager = class {
	constructor(id) {
		this._id = id;
		this._documentSnapshots = [];
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.COLLECTION_PATIENTS).doc(id).collection('medicines')
	}

	beginListening() {
		let query = this._ref.orderBy(rhit.MEDICINE_LAST_TOUCHED, "desc");
		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
		});
	}

	add() {
		firebase.firestore().collection(rhit.COLLECTION_PATIENTS).doc(this._id).collection('medicines').add({
				[rhit.MEDICINE_DOSAGE]: "dosage",
				[rhit.MEDICINE_NAME]: "name",
				[rhit.MEDICINE_PRIMARY_PROVIDER]: "primaryProvider",
				[rhit.MEDICINE_ISVALID]: "isValid",
				[rhit.MEDICINE_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then(function () {
				console.log(`Document created in Medicines Collection`);
			})
			.catch(function (error) {
				console.log("Error adding medicine document: ", error);
			});
	}

	set id(docRef) {
		this._id = docRef;
	}

	get id() {
		return this._id;
	}

	getMedicineAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const medicine = new rhit.Medicine(docSnapshot.id,
			docSnapshot.get(rhit.MEDICINE_DOSAGE),
			docSnapshot.get(rhit.MEDICINE_NAME),
			docSnapshot.get(rhit.MEDICINE_PRIMARY_PROVIDER),
			docSnapshot.get(rhit.MEDICINE_ISVALID),
			docSnapshot.get(rhit.MEDICINE_LAST_TOUCHED)
		);
		return medicine;
	}

	get documentSnapshots() {
		return this._documentSnapshots;
	}

	get length() {
		return this._documentSnapshots.length;
	}


}

// Notes Manager
/**
 * PURPOSE: Handles a Single Patient's Note Information
 */
rhit.NotesManager = class {
	constructor(id) {
		this._id = id;
		this._documentSnapshots = [];
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.COLLECTION_PATIENTS).doc(id).collection('notes')
	}

	beginListening() {
		let query = this._ref.orderBy(rhit.MEDICINE_LAST_TOUCHED, "desc");
		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
		});
	}

	add() {
		firebase.firestore().collection(rhit.COLLECTION_PATIENTS).doc(this._id).collection('notes').add({
				[rhit.NOTE_CREATED_BY]: "Dr.-----",
				[rhit.NOTE_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
				[rhit.NOTE_NOTE]: "This is a placeholder note",
			})
			.then(function () {
				console.log(`Document created in Notes Collection`);
			})
			.catch(function (error) {
				console.log("Error adding note document: ", error);
			});
	}

	set id(docRef) {
		this._id = docRef;
	}

	get id() {
		return this._id;
	}

	getNoteAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const note = new rhit.Note(docSnapshot.id,
			docSnapshot.get(rhit.NOTE_CREATED_BY),
			docSnapshot.get(rhit.NOTE_LAST_TOUCHED),
			docSnapshot.get(rhit.NOTE_NOTE),
		);
		return note;
	}

	get documentSnapshots() {
		return this._documentSnapshots;
	}

	get length() {
		return this._documentSnapshots.length;
	}

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
		this.bloodPressure = sortMap(objectToMap(bloodPressure));
		this.firstName = firstName;
		this.googleID = googleID;
		this.height = sortMap(objectToMap(height));
		this.lastName = lastName;
		this.lastOnline = lastOnline;
		this.primaryProvider = primaryProvider;
		this.pulse = sortMap(objectToMap(pulse));
		this.spo2 = sortMap(objectToMap(spo2));
		this.temperature = sortMap(objectToMap(temperature));
		this.weight = sortMap(objectToMap(weight));
	}
}

// Primary Provider Wrapper
/**
 * PURPOSE: Holds all data relevant to a signed in primary provider
 */
rhit.PrimaryProvider = class {
	constructor(id, firstName, lastName, patients) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.patient = patients;
	}
}

// Medicine Wrapper
/**
 * PURPOSE: Holds all data relevant to a Single Patient's Medicine
 */
rhit.Medicine = class {
	constructor(id, dosage, name, primaryProvider, isValid, lastTouched) {
		this.id = id;
		this.dosage = dosage;
		this.name = name;
		this.primaryProvider = primaryProvider;
		this.isValid = isValid;
		this.lastTouched = lastTouched;
	}
}

// Note Wrapper
/**
 * PURPOSE: Holds all data relevant to a Single Patient's Note
 */
rhit.Note = class {
	constructor(id, createdBy, lastTouched, note) {
		this.id = id;
		this.createdBy = createdBy;
		this.lastTouched = lastTouched;
		this.note = note;
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
	if (document.querySelector("#loginPage") && rhit.single_AuthManager.isSignedIn && rhit.single_AuthManager.isVerified) {
		window.location.href = `/patients.html?uid=${rhit.single_AuthManager.uid}`;
	}

	// if (!document.querySelector("#loginPage") && !rhit.single_AuthManager.isSignedIn) {
	// 	window.location.href = "/";
	// }
};


// Page Initialization
/**
 * PURPOSE: Page Initialization takes place here. Depending what page a user is on
 * will direct the user to the correct webpage
 * 
 */
rhit.initializePage = () => {
	const urlParams = new URLSearchParams(window.location.search);
	// * initializes page controller for Login Page
	if (document.querySelector("#loginPage")) {
		console.log("You are on the login page.");
		new rhit.LoginPageController();
	}

	// * initializes page controller for Login Page
	if (document.querySelector("#signupPage")) {
		console.log("You are on the signup page.");
		rhit.single_PrimaryProviderManager = new rhit.PrimaryProviderManager();

		new rhit.SignupPageController();
	}

	// * initializes page controller for Patients Page
	if (document.querySelector("#patientsPage")) {
		console.log("You are on the patients page.");
		const uid = urlParams.get("uid");
		rhit.single_PatientsManager = new rhit.PatientsManager();
		rhit.single_PrimaryProviderManager = new rhit.PrimaryProviderManager();


		new rhit.PatientsPageController();
	}

	// * initializes page controller for Single Patient Page
	if (document.querySelector("#singlePatientPage")) {
		console.log("You are on a single patient page.");
		const id = urlParams.get("id");
		if (!id) {
			window.location.href = "/patients.html";
		}
		rhit.single_SinglePatientManager = new rhit.SinglePatientManager(id);
		rhit.single_MedicinesManager = new rhit.MedicinesManager(id);
		rhit.single_NotesManager = new rhit.NotesManager(id);

		new rhit.SinglePatientPageController();
	}

	// * initializes page controller for Graphics Page
	if (document.querySelector("#graphicsPage")) {
		console.log("You are on the graphics page.");
		const id = urlParams.get("id");
		const vital = urlParams.get("vital");
		if (!id) {
			window.location.href = "/patients.html";
		}
		rhit.single_SinglePatientManager = new rhit.SinglePatientManager(id);
		rhit.single_SinglePatientManager.vital = vital;

		new rhit.GraphicsPageController(vital);
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

// From: https://www.tutorialspoint.com/convert-object-to-a-map-javascript
function objectToMap(obj) {
	const keys = Object.keys(obj);
	const map = new Map();
	for (let i = 0; i < keys.length; i++) {
		//inserting new key value pair inside map
		map.set(keys[i], obj[keys[i]]);
	};
	return map;
}

// From: https://javascript.plainenglish.io/how-to-sort-a-map-in-javascript-es6-59751f06f692
function sortMap(map) {
	let unSorted = Array.from(map);
	let sorted = unSorted.sort(([key1, value1], [key2, value2]) => key1.localeCompare(key2));

	let sortedMap = new Map(sorted);
	return sortedMap
}

// Google Charts function needed to create Graphic.
function drawChart() {
	const singlePatient = rhit.single_SinglePatientManager.getPatient()
	var data = new google.visualization.DataTable();
	let yAxis = "";
	let vital;
	data.addColumn('date', 'Date');
	data.addColumn('number', 'Value');

	switch (rhit.single_SinglePatientManager.vital) {
		case "Weight":
			vital = singlePatient.weight;
			yAxis = "Pounds (Lbs)";
			break;
		case "SPO2":
			vital = singlePatient.spo2;
			yAxis = "Oxygen Saturation (%)";
			break;
		case "Blood Pressure":
			vital = singlePatient.bloodPressure;
			yAxis = "mmHg";
			break;
		case "Height":
			vital = singlePatient.height;
			yAxis = "Inches";
			break;
		case "Pulse":
			vital = singlePatient.pulse;
			yAxis = "Beats per minute";
			break;
		case "Temperature":
			vital = singlePatient.temperature;
			yAxis = "Degrees (\xB0)";
			break;
		default:
	}

	let vals = []

	for (const [key, value] of vital) {
		let point = [parseDate(key), parseInt(value)];
		vals.push(point);
	}
	data.addRows(vals);

	var options = {
		series: {
			0: {
				color: '#c15027'
			},
		},
		hAxis: {
			title: 'Time'
		},
		vAxis: {
			title: yAxis

		},
		backgroundColor: '#F5F5F5',
		lineWidth: 3,
		fontName: 'Mukta',
		fontSize: 16
	};

	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.LineChart(document.getElementById('graphicsChart'));
	chart.draw(data, options);
	window.addEventListener('resize', drawChart, false);
}

// Function written to parse the time keys of the different vital maps
function parseDate(key) {
	let year = parseInt(key.substring(0, 4));
	let month = parseInt(key.substring(4, 6));
	let day = parseInt(key.substring(6, 8));
	let hour = parseInt(key.substring(9, 11));
	let minute = parseInt(key.substring(12, 14));

	return new Date(year, month, day, hour, minute);
}

// From Firebase Console
rhit.startFirebaseUI = function () {
	var uiConfig = {
		signInSuccessUrl: '/',
		signInOptions: [
			firebase.auth.EmailAuthProvider.PROVIDER_ID
		],
	};

	const ui = new firebaseui.auth.AuthUI(firebase.auth());
	ui.start('#firebaseui-auth-container', uiConfig);
}