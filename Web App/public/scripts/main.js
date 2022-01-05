var rhit = rhit || {};

rhit.fbAuthManager = null;

rhit.PatientsPageController = class {
	constructor() {
		document.querySelector("#signOutLink").onclick = (event) => {
			rhit.fbAuthManager.signOut();
		};
	}
}
rhit.LoginPageController = class {
	constructor() {
		document.querySelector("#loginButton").onclick = (event) => {
			rhit.fbAuthManager.signIn();
		};

		document.querySelector('#passwordInput').addEventListener("keyup", (event) => {
			if (event.keyCode === 13) { // 13 is the keyCode for Enter
				event.preventDefault();
				document.querySelector('#loginButton').click();
			}
		})
	}
}

rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
	}

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

	signOut() {
		firebase.auth().signOut().catch((error) => {
			console.log("Sign out error");
		});
	}

	get isSignedIn() {
		return !!this._user;
	}
	get uid() {
		return this._user.uid;
	}
}

rhit.checkForRedirects = () => {
	if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/patients.html";
	}
	if (!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/";
	}
};

rhit.initializePage = () => {
	const urlParams = new URLSearchParams(window.location.search);
	if (document.querySelector("#loginPage")) {
		console.log("You are on the login page.");
		new rhit.LoginPageController();
	}
	if (document.querySelector("#patientsPage")) {
		console.log("You are on the patients page.");
		new rhit.PatientsPageController();
	}
};

rhit.main = function () {
	console.log("Ready");

	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		console.log("isSignedIn = ", rhit.fbAuthManager.isSignedIn);
		rhit.checkForRedirects();
		rhit.initializePage();
	});
};

rhit.main();