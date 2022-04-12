var rhit = rhit || {};

/** PRIMARY PROVIDER COLLECTION **/
rhit.COLLECTION_PRIMARY_PROVIDERS = "primaryProviders";
rhit.PROVIDER_EMAIL = "email";
rhit.PROVIDER_FIRST_NAME = "firstName";
rhit.PROVIDER_LAST_NAME = "lastName";
rhit.PROVIDER_PATIENTS = "patients";
rhit.PROVIDER_UID = "uid";

/** PATIENT COLLECTION **/
rhit.COLLECTION_PATIENTS = "patients";
rhit.PATIENT_ADDRESS = "address";
rhit.PATIENT_BIRTHDATE = "birthdate";
rhit.PATIENT_DIASTOLIC_PRESSURE = "diastolicPressure";
rhit.PATIENT_EM_CONTACT_NAME = "emContactName";
rhit.PATIENT_EM_CONTACT_PHONE = "emContactPhone";
rhit.PATIENT_EMAIL = "email";
rhit.PATIENT_FIRST_NAME = "firstName";
rhit.PATIENT_GENDER = "gender";
rhit.PATIENT_GOOGLE_ID = "googleID";
rhit.PATIENT_HEIGHT = "height";
rhit.PATIENT_LAST_NAME = "lastName";
rhit.PATIENT_LAST_ONLINE = "lastOnline";
rhit.PATIENT_PHONE = "phone";
rhit.PATIENT_PRIMARY_PROVIDER = "primaryProvider";
rhit.PATIENT_PULSE = "pulse";
rhit.PATIENT_SPO2 = "spo2";
rhit.PATIENT_SYSTOLIC_PRESSURE = "systolicPressure";
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

		document.querySelector("#returnButton").onclick = (event) => {
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

		// * Click Listener for viewing primary provider profile
		document.querySelector("#primaryProviderProfile").onclick = (event) => {
			window.location.href = `/provider_profile.html?uid=${rhit.single_AuthManager.uid}`;
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
		rhit.single_PrimaryProviderManager.beginListenForDocument(true);
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
            							<p>Last online: ${parseOnlineDate(patient.lastOnline)}</p>
            							<button data-id=${patient.id} id="selectButton" class="btn btn-primary" type="button">Select</button>
          							</div>
        						</div>
      						</div>`);
	}
}

// Primary Provider Profile Page Controller
/**
 * PURPOSE: Handle all View and Controller interactions for the Provider Profile Page
 */
rhit.ProviderProfilePageController = class {
	constructor() {
		// * Click Listener for sign out on Single Patient Page
		document.querySelector("#signOutLink").onclick = (event) => {
			rhit.single_AuthManager.signOut();
			window.location.href = "/";
		};

		// * Click Listener for Go Back
		document.querySelector("#goBackLink").onclick = (event) => {
			window.location.href = `/patients.html?uid=${rhit.single_AuthManager.uid}`;
		};

		// * Click Listener for save button on account modal
		document.querySelector("#deleteButton").onclick = (event) => {
			rhit.single_PatientsManager.repopulate(this.removePatients.bind(this), "patients", null);
		};


		// * Click Listener for save button on patient modal
		document.querySelector("#saveButton").onclick = (event) => {
			this.updatePatients();
		};

		rhit.single_PatientsManager.beginListening(this.updateList.bind(this), rhit.PATIENT_LAST_NAME, "desc");
		rhit.single_PrimaryProviderManager.beginListenForDocument(false, this.updateView.bind(this));
	}

	updateView() {
		document.querySelector("#providerProfileName").innerHTML = `Name: ${rhit.single_PrimaryProviderManager.firstName} ${rhit.single_PrimaryProviderManager.lastName}`
		document.querySelector("#providerProfileEmail").innerHTML = `Email: ${rhit.single_PrimaryProviderManager.email}`

		const newList = htmlToElement('<div id="providerProfilePatients"></div>');
		for (let i = 0; i < rhit.single_PrimaryProviderManager.patients.length; i++) {
			let patient = rhit.single_PrimaryProviderManager.patients[i];
			let item = document.createElement('p');
			item.id = "providerProfileItem";
			item.innerHTML = `&bull; ${patient}`;
			newList.appendChild(item);
		}

		const oldList = document.querySelector("#providerProfilePatients");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}

	updateList() {
		const newList = htmlToElement('<ul id="modalList"></ul>');
		for (let i = 0; i < rhit.single_PatientsManager.length; i++) {
			const patient = rhit.single_PatientsManager.getPatientAtIndex(i);
			let item = this._createItem(patient);
			let checkbox = document.createElement('input');
			checkbox.type = 'checkbox';

			if (patient.primaryProvider == rhit.single_PrimaryProviderManager.lastName) {
				checkbox.checked = true;
			}

			item.appendChild(checkbox);
			newList.appendChild(item);
		}

		const oldList = document.querySelector("#modalList");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}

	updatePatients() {
		let newPatients = [];
		let patients = document.querySelectorAll("#patientItem");
		for (let i = patients.length - rhit.single_PatientsManager.length; i < patients.length; i++) {
			if (patients[i].firstElementChild.checked == true) {
				rhit.single_SinglePatientManager = new rhit.SinglePatientManager(patients[i].dataset.id);
				rhit.single_SinglePatientManager.beginListening(rhit.single_SinglePatientManager.update(rhit.single_PrimaryProviderManager.lastName))

				newPatients.push(patients[i].dataset.name);
			} else if (patients[i].firstElementChild.checked == false) {
				rhit.single_SinglePatientManager = new rhit.SinglePatientManager(patients[i].dataset.id);
				rhit.single_SinglePatientManager.beginListening(rhit.single_SinglePatientManager.update(""));
			}
		}
		rhit.single_PrimaryProviderManager.update(newPatients);
	}

	removePatients() {
		for (let i = 0; i < rhit.single_PatientsManager.length; i++) {
			rhit.single_SinglePatientManager = new rhit.SinglePatientManager(rhit.single_PatientsManager.getPatientAtIndex(i).id);
			rhit.single_SinglePatientManager.beginListening(rhit.single_SinglePatientManager.update(""));
		}
		rhit.single_PrimaryProviderManager.delete();
	}

	_createItem(patient) {
		return htmlToElement(`<li id="patientItem" data-id=${patient.id} data-name="${patient.firstName} ${patient.lastName}"> ${patient.firstName} ${patient.lastName} - Current Provider: ${patient.primaryProvider} </li>`);
	}
}

// Patient Profile Page Controller
/**
 * PURPOSE: Handle all View and Controller interactions for the Patient Profile Page
 */
 rhit.PatientProfilePageController = class {
	constructor() {
		// * Click Listener for sign out on Single Patient Page
		document.querySelector("#signOutLink").onclick = (event) => {
			rhit.single_AuthManager.signOut();
			window.location.href = "/";
		};

		// * Click Listener for Go Back
		document.querySelector("#goBackLink").onclick = (event) => {
			window.location.href = `/single_patient.html?uid=${rhit.single_AuthManager.uid}&id=${rhit.single_SinglePatientManager.id}`;		
		};

		// // * Click Listener for save button on account modal
		// document.querySelector("#deleteButton").onclick = (event) => {
		// 	rhit.single_PatientsManager.repopulate(this.removePatients.bind(this), "patients", null);
		// };


		// // * Click Listener for save button on patient modal
		// document.querySelector("#saveButton").onclick = (event) => {
		// 	this.updatePatients();
		// };

		rhit.single_SinglePatientManager.beginListening(this.updateView.bind(this));
	}

	updateView() {
		document.querySelector("#patientProfileName").innerHTML = `Name: ${rhit.single_SinglePatientManager.firstName} ${rhit.single_SinglePatientManager.lastName}`
		document.querySelector("#patientBirthdate").innerHTML = `Birth Date: ${rhit.single_SinglePatientManager.birthdate}`
		document.querySelector("#patientProfileEmail").innerHTML = `Email: ${rhit.single_SinglePatientManager.email}`
		document.querySelector("#patientProfileGender").innerHTML = `Gender: ${rhit.single_SinglePatientManager.gender}`
		document.querySelector("#patientProfilePhone").innerHTML = `Phone: ${rhit.single_SinglePatientManager.phone}`
		document.querySelector("#patientProfilePrimaryProvider").innerHTML = `Primary Provider: ${rhit.single_SinglePatientManager.primaryProvider}`
		document.querySelector("#patientProfileEmContactName").innerHTML = `Name: ${rhit.single_SinglePatientManager.emContactName}`
		document.querySelector("#patientProfileEmContactPhone").innerHTML = `Phone: ${rhit.single_SinglePatientManager.emContactPhone}`
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

		// * Click Listener for viewing primary provider profile
		document.querySelector("#primaryProviderProfile").onclick = (event) => {
			window.location.href = `/provider_profile.html?uid=${rhit.single_AuthManager.uid}`;
		};

		// TODO (Change the href location) - * Click Listener for viewing patient profile
		document.querySelector("#patientProviderProfile").onclick = (event) => {
			window.location.href = `/patient_profile.html?id=${rhit.single_SinglePatientManager.id}`;
		}

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

		// * Click Listener for Adding a Medicine
		document.querySelector("#medicinesCreateButton").onclick = (event) => {
			const medicineName = document.querySelector("#medicineModalName");
			const medicineDosage = document.querySelector("#medicineModalDosage");
			rhit.single_MedicinesManager.add(medicineName.value, medicineDosage.value);
		};

		// * Click Listener for Editing a Medicine
		document.querySelector("#medicinesSaveButton").onclick = (event) => {
			const medicineName = document.querySelector("#medicineModalEditName");
			const medicineDosage = document.querySelector("#medicineModalEditDosage");
			rhit.single_MedicinesManager.update(medicineName.value, medicineDosage.value);
		};

		// * Click Listener for Deleting a Medicine
		document.querySelector("#medicineDeleteButton").onclick = (event) => {
			rhit.single_MedicinesManager.delete();
		};

		// * Click Listener for Adding a Note
		document.querySelector("#notesCreateButton").onclick = (event) => {
			const noteText = document.querySelector("#noteModalNote");
			rhit.single_NotesManager.add(noteText.value);
		};

		// * Click Listener for Editing a Note
		document.querySelector("#notesSaveButton").onclick = (event) => {
			const noteText = document.querySelector("#noteModalEditNote");
			rhit.single_NotesManager.update(noteText.value);
		};

		// * Click Listener for Deleting a Note
		document.querySelector("#noteDeleteButton").onclick = (event) => {
			rhit.single_NotesManager.delete();
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

		rhit.single_SinglePatientManager.beginListening(this.updateView.bind(this));
		rhit.single_MedicinesManager.beginListening(this.updateView.bind(this));
		rhit.single_NotesManager.beginListening(this.updateView.bind(this));
	}

	updateView() {
		document.querySelector("#singlePatientHeader").innerHTML = `${rhit.single_SinglePatientManager.lastName}, ${rhit.single_SinglePatientManager.firstName}`
		document.querySelector("#singlePatientBreadCrumb").innerHTML = `${rhit.single_SinglePatientManager.lastName}, ${rhit.single_SinglePatientManager.firstName}`.toUpperCase()
		document.querySelector("#singlePatientTitle").innerHTML = `${rhit.single_SinglePatientManager.lastName}, ${rhit.single_SinglePatientManager.firstName}`
		document.querySelector("#vitalsLastOnline").innerHTML = `Last Online: ${this._parseDate(rhit.single_SinglePatientManager.lastOnline)}`

		this.updateCardsView();
	}

	updateMedicineModal() {
		document.querySelector("#medicineModalEditName").value = rhit.single_MedicinesManager.name;
		document.querySelector("#medicineModalEditDosage").value = rhit.single_MedicinesManager.dosage;
	}

	updateNoteModal() {
		document.querySelector("#noteModalEditNote").value = rhit.single_NotesManager.note;
	}

	updateCardsView() {
		const singlePatient = rhit.single_SinglePatientManager.getPatient()

		// VITALS CARD
		document.querySelector("#weightData").innerHTML = `Weight: ${(singlePatient.weight.values().next().value) ?  singlePatient.weight.values().next().value : "--"} lbs`;
		document.querySelector("#spo2Data").innerHTML = `SPO2: ${(singlePatient.spo2.values().next().value) ?  singlePatient.spo2.values().next().value : "--"} %`;
		document.querySelector("#bloodPressureData").innerHTML = `Blood Pressure: 
			${(singlePatient.systolicPressure.values().next().value) ? singlePatient.systolicPressure.values().next().value : "--"}
			/${(singlePatient.diastolicPressure.values().next().value) ? singlePatient.diastolicPressure.values().next().value : "--"} mmHg`;
		document.querySelector("#heightData").innerHTML = `Height: ${(singlePatient.height.values().next().value) ? singlePatient.height.values().next().value : "--"} in`;
		document.querySelector("#pulseData").innerHTML = `Pulse: ${(singlePatient.pulse.values().next().value) ? singlePatient.pulse.values().next().value : "--"} bpm`;
		document.querySelector("#temperatureData").innerHTML = `Temperature: ${(singlePatient.temperature.values().next().value) ? singlePatient.temperature.values().next().value : "--"} \xB0`;

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

		// * Adds listener to the select button in each medicine card in the patients list
		const medicationCards = document.querySelectorAll(".medicationCardInfo");
		for (const med of medicationCards) {
			med.addEventListener("click", (event) => {
				rhit.single_MedicinesManager.beginListenForDocument(med.dataset.id, this.updateMedicineModal.bind(this));
			})
		}

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

		// * Adds listener to the select button in each medicine card in the patients list
		const notesCards = document.querySelectorAll(".specificNoteCardInfo");
		for (const not of notesCards) {
			not.addEventListener("click", (event) => {
				rhit.single_NotesManager.beginListenForDocument(not.dataset.id, this.updateNoteModal.bind(this));
			})
		}
	}

	_createMedicineCard(medicine) {
		return htmlToElement(`<div class="medicationCard card">
		<div data-bs-toggle="modal" data-bs-target="#medicineEditModal"class="medicationCardBody card-body">
		  <div data-id=${medicine.id} class="medicationCardInfo">
			<p class="medicationName">${medicine.name}</p>
			<p>Dosage: ${medicine.dosage}</p>
		  </div>
		</div>
	  </div>>`);
	}

	_createNoteCard(note) {
		return htmlToElement(`<div class="specificNoteCard card">
		<div data-bs-toggle="modal" data-bs-target="#noteEditModal" class="specificNoteCardBody card-body">
		  <div data-id=${note.id} class="specificNoteCardInfo">
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

		// * Click Listener for viewing primary provider profile
		document.querySelector("#primaryProviderProfile").onclick = (event) => {
			window.location.href = `/provider_profile.html?uid=${rhit.single_AuthManager.uid}`;
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

		if (this._vital != "Blood Pressure") {
			let vital;
			switch (this._vital) {
				case "Weight":
					vital = singlePatient.weight;
					break;
				case "SPO2":
					vital = singlePatient.spo2;
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
		} else {
			let sys_vital = Array.from(singlePatient.systolicPressure);
			let dia_vital = Array.from(singlePatient.diastolicPressure);

			const historyList = htmlToElement('<div id="graphicsInfo"></div>');
			for (let i = 0; i < sys_vital.length; i++) {
				let value = `${sys_vital[i][1]}/${dia_vital[i][1]}`;
				const newCard = this._createHistoryCard(sys_vital[i][0], value);
				historyList.appendChild(newCard);
			}

			const oldHistoryList = document.querySelector("#graphicsInfo");
			oldHistoryList.removeAttribute("id");
			oldHistoryList.hidden = true;
			oldHistoryList.parentElement.appendChild(historyList);
		}

	}
	_createHistoryCard(key, value) {
		let date = parseDate(key)
		return htmlToElement(`<div class="historyCard card">
		<div class="historyCardBody card-body">
		  <div class="historyCardInfo">
			<p>Data: ${value}</p>
			<p>Date: ${date.getMonth()}/${date.getDate()}/${date.getYear()%100}</p>
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
				this.sendLink(emailInput, nameInput);
			})
			.catch((error) => {
				const code = error.code;
				const errorMessage = error.message;
				console.log("Exisiting account log in error", code, errorMessage);
			});
	}

	deleteUser() {
		firebase.auth().currentUser.delete().then(() => {
			window.location.href = "/";
		}).catch((error) => {
			console.log(`Error: ${error}`);
		});
	}

	sendLink(emailInput, nameInput) {
		firebase.auth().currentUser.sendEmailVerification()
			.then(() => {
				console.log("Sending Email Verification!");
				const names = nameInput.value.split(" ");
				// Sign the Primary Provider Out
				// Return back to the Login Page after a certain amount time
				// Save Users Email, First Name, and Last Name in Local Storage
				window.localStorage.setItem("Email", emailInput.value);
				window.localStorage.setItem("First Name", names[0]);
				window.localStorage.setItem("Last Name", names[1]);
				rhit.single_AuthManager.signOut();
				window.location.href = "/";
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

	beginListenForDocument(check = false, changeListener = null) {
		this._unsubscribe = this._ref.doc(rhit.single_AuthManager.uid).onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Docoument exists!");
				this._document = doc;
				if (changeListener != null) {
					changeListener();
				}
			}
			if (!doc.exists && check) {
				console.log("Document does not exist!");
				rhit.single_PrimaryProviderManager.add(window.localStorage.getItem("Email"), window.localStorage.getItem("First Name"), window.localStorage.getItem("Last Name"),
					rhit.single_AuthManager.uid);
			}
		});
	}

	stopListening() {
		this._unsubscribe();
	}

	add(email, firstName, lastName, uid) {
		this._ref.doc(`${uid}`).set({
				[rhit.PROVIDER_EMAIL]: email,
				[rhit.PROVIDER_FIRST_NAME]: firstName,
				[rhit.PROVIDER_LAST_NAME]: lastName,
				[rhit.PROVIDER_PATIENTS]: [],
			})
			.then(() => {
				window.localStorage.removeItem("Email");
				window.localStorage.removeItem("First Name");
				window.localStorage.removeItem("Last Name");
			}).catch(function (error) {
				console.log("Error adding document: ", error);
			});
	}

	update(patients) {
		this._ref.doc(`${rhit.single_AuthManager.uid}`).set({
				[rhit.PROVIDER_EMAIL]: rhit.single_PrimaryProviderManager.email,
				[rhit.PROVIDER_FIRST_NAME]: rhit.single_PrimaryProviderManager.firstName,
				[rhit.PROVIDER_LAST_NAME]: rhit.single_PrimaryProviderManager.lastName,
				[rhit.PROVIDER_PATIENTS]: patients,
			})
			.catch(function (error) {
				console.log("Error adding document: ", error);
			});
	}

	delete() {
		return this._ref.doc(`${rhit.single_AuthManager.uid}`).delete().then(() => {
			rhit.single_AuthManager.deleteUser();
		}).catch((error) => {
			console.error("Error removing document: ", error);
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
			docSnapshot.get(rhit.PROVIDER_EMAIL),
			docSnapshot.get(rhit.PROVIDER_FIRST_NAME),
			docSnapshot.get(rhit.PROVIDER_LAST_NAME),
			docSnapshot.get(rhit.PROVIDER_PATIENTS),
		);
		return provider;
	}

	get firstName() {
		return this._document.get(rhit.PROVIDER_FIRST_NAME);
	}

	get lastName() {
		return this._document.get(rhit.PROVIDER_LAST_NAME);
	}

	get email() {
		return this._document.get(rhit.PROVIDER_EMAIL);
	}

	get patients() {
		return this._document.get(rhit.PROVIDER_PATIENTS);
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
				[rhit.PATIENT_DIASTOLIC_PRESSURE]: {},
				[rhit.PATIENT_EM_CONTACT_NAME]: "Contact Name",
				[rhit.PATIENT_EM_CONTACT_PHONE]: "18005006464",
				[rhit.PATIENT_EMAIL]: "---@gmail.com",
				[rhit.PATIENT_FIRST_NAME]: "Abby",
				[rhit.PATIENT_GENDER]: "m/f",
				[rhit.PATIENT_GOOGLE_ID]: "googleID",
				[rhit.PATIENT_HEIGHT]: {},
				[rhit.PATIENT_LAST_NAME]: "Holder",
				[rhit.PATIENT_LAST_ONLINE]: firebase.firestore.Timestamp.now(),
				[rhit.PATIENT_PHONE]: "1800050005000",
				[rhit.PATIENT_PRIMARY_PROVIDER]: "primaryProvider",
				[rhit.PATIENT_PULSE]: {},
				[rhit.PATIENT_SPO2]: {},
				[rhit.PATIENT_SYSTOLIC_PRESSURE]: {},
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
			docSnapshot.get(rhit.PATIENT_DIASTOLIC_PRESSURE),
			docSnapshot.get(rhit.PATIENT_EM_CONTACT_NAME),
			docSnapshot.get(rhit.PATIENT_EM_CONTACT_PHONE),
			docSnapshot.get(rhit.PATIENT_EMAIL),
			docSnapshot.get(rhit.PATIENT_FIRST_NAME),
			docSnapshot.get(rhit.PATIENT_GENDER),
			docSnapshot.get(rhit.PATIENT_GOOGLE_ID),
			docSnapshot.get(rhit.PATIENT_HEIGHT),
			docSnapshot.get(rhit.PATIENT_LAST_NAME),
			docSnapshot.get(rhit.PATIENT_LAST_ONLINE),
			docSnapshot.get(rhit.PATIENT_PHONE),
			docSnapshot.get(rhit.PATIENT_PRIMARY_PROVIDER),
			docSnapshot.get(rhit.PATIENT_PULSE),
			docSnapshot.get(rhit.PATIENT_SPO2),
			docSnapshot.get(rhit.PATIENT_SYSTOLIC_PRESSURE),
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

	beginListening(changeListener = null) {
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				// console.log("Document data:", doc.data());
				this._documentSnapshot = doc;
				if (changeListener != null) {
					changeListener();
				}
			} else {
				console.log("No such document!");
			}
		});
	}

	stopListening() {
		this._unsubscribe();
	}

	update(primaryProvider) {
		this._ref.update({
			[rhit.PATIENT_PRIMARY_PROVIDER]: primaryProvider,
		})
	}

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

	get diastolicPressure() {
		return this._documentSnapshot.get(rhit.PATIENT_DIASTOLIC_PRESSURE);
	}

	get emContactName() {
		return this._documentSnapshot.get(rhit.PATIENT_EM_CONTACT_NAME);
	}

	get emContactPhone() {
		return this._documentSnapshot.get(rhit.PATIENT_EM_CONTACT_PHONE);
	}

	get email() {
		return this._documentSnapshot.get(rhit.PATIENT_EMAIL);
	}

	get firstName() {
		return this._documentSnapshot.get(rhit.PATIENT_FIRST_NAME);
	}

	get gender() {
		return this._documentSnapshot.get(rhit.PATIENT_GENDER);
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

	get phone() {
		return this._documentSnapshot.get(rhit.PATIENT_PHONE);
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

	get systolicPressure() {
		return this._documentSnapshot.get(rhit.PATIENT_SYSTOLIC_PRESSURE);
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
			docSnapshot.get(rhit.PATIENT_DIASTOLIC_PRESSURE),
			docSnapshot.get(rhit.PATIENT_EM_CONTACT_NAME),
			docSnapshot.get(rhit.PATIENT_EM_CONTACT_PHONE),
			docSnapshot.get(rhit.PATIENT_EMAIL),
			docSnapshot.get(rhit.PATIENT_FIRST_NAME),
			docSnapshot.get(rhit.PATIENT_GENDER),
			docSnapshot.get(rhit.PATIENT_GOOGLE_ID),
			docSnapshot.get(rhit.PATIENT_HEIGHT),
			docSnapshot.get(rhit.PATIENT_LAST_NAME),
			docSnapshot.get(rhit.PATIENT_LAST_ONLINE),
			docSnapshot.get(rhit.PATIENT_PHONE),
			docSnapshot.get(rhit.PATIENT_PRIMARY_PROVIDER),
			docSnapshot.get(rhit.PATIENT_PULSE),
			docSnapshot.get(rhit.PATIENT_SPO2),
			docSnapshot.get(rhit.PATIENT_SYSTOLIC_PRESSURE),
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
		this._document = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.COLLECTION_PATIENTS).doc(id).collection('medicines')
	}

	beginListening(changeListener = null) {
		let query = this._ref.orderBy(rhit.MEDICINE_LAST_TOUCHED, "desc");
		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			if (changeListener != null) {
				changeListener();
			}
		});
	}

	beginListenForDocument(id, changeListener = null) {
		this._unsubscribe = this._ref.doc(id).onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Docoument exists!");
				this._document = doc;
				if (changeListener != null) {
					changeListener();
				}
			}
		});
	}

	add(name, dosage) {
		firebase.firestore().collection(rhit.COLLECTION_PATIENTS).doc(this._id).collection('medicines').add({
				[rhit.MEDICINE_DOSAGE]: dosage,
				[rhit.MEDICINE_NAME]: name,
				[rhit.MEDICINE_PRIMARY_PROVIDER]: rhit.single_PrimaryProviderManager.lastName,
				[rhit.MEDICINE_ISVALID]: true,
				[rhit.MEDICINE_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then(function () {
				console.log(`Document created in Medicines Collection`);
			})
			.catch(function (error) {
				console.log("Error adding medicine document: ", error);
			});
	}

	update(name, dosage) {
		this._ref.doc(rhit.single_MedicinesManager.getMedicine().id).set({
				[rhit.MEDICINE_DOSAGE]: dosage,
				[rhit.MEDICINE_NAME]: name,
				[rhit.MEDICINE_PRIMARY_PROVIDER]: rhit.single_PrimaryProviderManager.lastName,
				[rhit.MEDICINE_ISVALID]: true,
				[rhit.MEDICINE_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then(function () {
				console.log(`Medicine Document updated`);
			})
			.catch(function (error) {
				console.log("Error adding medicine document: ", error);
			});
	}

	delete() {
		this._ref.doc(rhit.single_MedicinesManager.getMedicine().id).delete().then(() => {
			console.log("The Medicine was deleted");
		}).catch((error) => {
			console.error("Error removing document: ", error);
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

	getMedicine() {
		const docSnapshot = this._document;
		const medicine = new rhit.Medicine(docSnapshot.id,
			docSnapshot.get(rhit.MEDICINE_DOSAGE),
			docSnapshot.get(rhit.MEDICINE_NAME),
			docSnapshot.get(rhit.MEDICINE_PRIMARY_PROVIDER),
			docSnapshot.get(rhit.MEDICINE_ISVALID),
			docSnapshot.get(rhit.MEDICINE_LAST_TOUCHED)
		);
		return medicine;
	}

	get document_id() {
		return this._document.get(id);
	}

	get name() {
		return this._document.get(rhit.MEDICINE_NAME);
	}

	get dosage() {
		return this._document.get(rhit.MEDICINE_DOSAGE);
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
		this._document = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.COLLECTION_PATIENTS).doc(id).collection('notes')
	}

	beginListening(changeListener = null) {
		let query = this._ref.orderBy(rhit.MEDICINE_LAST_TOUCHED, "desc");
		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			if (changeListener != null) {
				changeListener();
			}
		});
	}

	beginListenForDocument(id, changeListener = null) {
		this._unsubscribe = this._ref.doc(id).onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Docoument exists!");
				this._document = doc;
				if (changeListener != null) {
					changeListener();
				}
			}
		});
	}

	add(note) {
		firebase.firestore().collection(rhit.COLLECTION_PATIENTS).doc(this._id).collection('notes').add({
				[rhit.NOTE_CREATED_BY]: `Dr.${rhit.single_PrimaryProviderManager.lastName}`,
				[rhit.NOTE_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
				[rhit.NOTE_NOTE]: note,
			})
			.then(function () {
				console.log(`Document created in Notes Collection`);
			})
			.catch(function (error) {
				console.log("Error adding note document: ", error);
			});
	}

	update(note) {
		this._ref.doc(rhit.single_NotesManager.getNote().id).set({
				[rhit.NOTE_CREATED_BY]: `Dr.${rhit.single_PrimaryProviderManager.lastName}`,
				[rhit.NOTE_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
				[rhit.NOTE_NOTE]: note,
			})
			.then(function () {
				console.log(`Document created in Notes Collection`);
			})
			.catch(function (error) {
				console.log("Error adding note document: ", error);
			});
	}

	delete() {
		this._ref.doc(rhit.single_NotesManager.getNote().id).delete().then(() => {
			console.log("The Note was deleted");
		}).catch((error) => {
			console.error("Error removing document: ", error);
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

	getNote() {
		const docSnapshot = this._document;
		const note = new rhit.Note(docSnapshot.id,
			docSnapshot.get(rhit.NOTE_CREATED_BY),
			docSnapshot.get(rhit.NOTE_LAST_TOUCHED),
			docSnapshot.get(rhit.NOTE_NOTE),
		);
		return note;
	}

	get document_id() {
		return this._document.get(id);
	}

	get note() {
		return this._document.get(rhit.NOTE_NOTE);
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
	constructor(id, address, birthdate, diastolicPressure, emContactName, emContactPhone, email, firstName, gender, googleID,
		height, lastName, lastOnline, phone, primaryProvider, pulse,
		spo2, systolicPressure, temperature, weight) {
		this.id = id;
		this.address = address;
		this.birthdate = birthdate;
		this.diastolicPressure = sortMap(objectToMap(diastolicPressure));
		this.emContactName = emContactName;
		this.emContactPhone = emContactPhone;
		this.email = email;
		this.firstName = firstName;
		this.gender = gender;
		this.googleID = googleID;
		this.height = sortMap(objectToMap(height));
		this.lastName = lastName;
		this.lastOnline = lastOnline;
		this.phone = phone;
		this.primaryProvider = primaryProvider;
		this.pulse = sortMap(objectToMap(pulse));
		this.spo2 = sortMap(objectToMap(spo2));
		this.systolicPressure = sortMap(objectToMap(systolicPressure))
		this.temperature = sortMap(objectToMap(temperature));
		this.weight = sortMap(objectToMap(weight));
	}
}

// Primary Provider Wrapper
/**
 * PURPOSE: Holds all data relevant to a signed in primary provider
 */
rhit.PrimaryProvider = class {
	constructor(id, email, firstName, lastName, patients) {
		this.id = id;
		this.email = email;
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

	// * initializes page controller for Provider Profile Page
	if (document.querySelector("#providerProfilePage")) {
		console.log("You are on the provider profile page.");
		const uid = urlParams.get("uid");

		rhit.single_PatientsManager = new rhit.PatientsManager();
		rhit.single_PrimaryProviderManager = new rhit.PrimaryProviderManager();

		rhit.single_PrimaryProviderManager.beginListenForDocument();

		new rhit.ProviderProfilePageController();
	}

	// * initializes page controller for Patient Profile Page
	if (document.querySelector("#patientProfilePage")) {
		console.log("You are on the patient profile page.");
		const id = urlParams.get("id");
		if (!id) {
			window.location.href = "/patients.html";
		}
		rhit.single_SinglePatientManager = new rhit.SinglePatientManager(id);

		new rhit.PatientProfilePageController();
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

		rhit.single_PrimaryProviderManager = new rhit.PrimaryProviderManager();

		rhit.single_PrimaryProviderManager.beginListenForDocument();

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

	if (rhit.single_SinglePatientManager.vital != "Blood Pressure") {
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

		let vals = Array.from(vital)

		for (let i = 0; i < vals.length; i++) {
			vals[i][0] = parseDate(vals[i][0]);
			vals[i][1] = parseInt(vals[i][1]);
		}


		data.addRows(vals);

		var options = {
			colors: ['#c15027'],
			series: {
				0: {
					pointShape: {
						type: 'circle',
						dent: 0.2
					}
				},
			},
			hAxis: {
				title: 'Time'
			},
			vAxis: {
				title: yAxis

			},
			pointSize: 8,
			backgroundColor: '#F5F5F5',
			lineWidth: 3,
			fontName: 'Mukta',
			fontSize: 16
		};

		// Instantiate and draw our chart, passing in some options.
		var chart = new google.visualization.LineChart(document.getElementById('graphicsChart'));
		chart.draw(data, options);
		window.addEventListener('resize', drawChart, false);
	} else {

		let sys_vital = singlePatient.systolicPressure;
		let dia_vital = singlePatient.diastolicPressure;


		data.addColumn('date', 'Date');
		data.addColumn('number', 'Systolic BP');
		data.addColumn('number', 'Diastolic BP');

		let sys_vals = Array.from(sys_vital);
		let dia_sys = Array.from(dia_vital)

		console.log(sys_vals);

		for (let i = 0; i < sys_vals.length; i++) {
			sys_vals[i][0] = parseDate(sys_vals[i][0], true);
			sys_vals[i][1] = parseInt(sys_vals[i][1]);
			sys_vals[i].push(parseInt(dia_sys[i][1]));
		}

		console.log(sys_vals);

		data.addRows(sys_vals);

		var options = {
			colors: ['#c15027', '#43459d'],
			series: {
				0: {
					pointShape: {
						type: 'circle',
						dent: 0.2
					}
				},
				1: {
					pointShape: {
						type: 'circle',
						dent: 0.2
					}
				},
			},
			hAxis: {
				title: 'Time'
			},
			vAxis: {
				title: yAxis

			},
			pointSize: 8,
			legend: {
				position: 'bottom'
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
}

 function parseOnlineDate(timestamp) {
	const date = timestamp.toDate();
	const year = date.getYear().toString();
	return `${date.getMonth()+1}/${date.getDate()}/20${year.substring(1,3)} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

// Function written to parse the time keys of the different vital maps
function parseDate(key, seconds = false) {
	let year = parseInt(key.substring(0, 4));
	let month = parseInt(key.substring(4, 6));
	let day = parseInt(key.substring(6, 8));
	let hour = parseInt(key.substring(9, 11));
	let minute = parseInt(key.substring(12, 14));

	if (!seconds) {
		return new Date(year, month, day, hour, minute);

	} else {
		let seconds = parseInt(key.substring(15, 17));
		return new Date(year, month, day, hour, minute, seconds);

	}
}