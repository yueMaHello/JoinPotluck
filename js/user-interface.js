let user = {
    name: "",
    email: "",
    phone: "",
    email_verified: "false",
    update: function (userInfo) {
        for (let key in userInfo) {
            if (this[key] !== undefined) {
                this[key] = userInfo[key];
            }
        }
    }
};

function visibility(divElementId, show = false) {
    let divElement = document.getElementById(divElementId);
    if (show) {
        divElement.style.display = "block";
    } else {
        divElement.style.display = "none";
    }
}

function showAlertMessage(alertType, message) {
    $("#operationAlert span").remove();
    $("#operationAlert").attr('class', "alert alert-" + alertType);
    $("#operationAlert button").after('<span>' + message + '</span>');
    $("#operationAlert").fadeIn('slow');
    $("#operationAlert").show();
}

function closeAlertMessage() {
    $("#operationAlert span").remove();
    $("#operationAlert").hide();
}

function createCallback(successMessage, email = "", name = "", phone = "", confirmed = "") {
    return (err, result) => {
		let message;
		if (err) {
			message = "<strong>" + err.name + "</strong>: " + err.message;
			showAlertMessage('danger', message);
		} else {
			user.update({
				name: name,
				email: email,
				email_verified: confirmed,
				status: status
			});
			message = "<strong>Success</strong>: " + successMessage;
			showAlertMessage('success', message);
			userAttributes(updateTable);
		}
    };
}


function modalFormEnter() {
    let buttonText = $("#modalFormButton").text();
    let email = $("#userEmail").val();
	let name = $("#userName").val();
    let phone = $("#userPhone").val();
    let code = $("#userConfirmationCode").val();
    let password = $("#userPassword").val();

    let callback;
    let message;
    switch (buttonText) {
        case "Sign Up":
            message = `User <i>(${email})</i> added to the user pool`;
            callback = createCallback(message, email, name, phone, "false");
            signUpUser(email, name, phone, password, callback);
            break;

        case "Confirm":
            message = `User confirmed email address ${email}`;
            callback = createCallback(message, user.email, name, phone, "true");
            confirmUser(email, code, callback);
            break;

        case "Sign In":
			message = `User <i>(${email})</i> signed in`;
            callback = createCallback(message, email, name, phone, "true");
            signInUser(email, password, callback);
            break;
    }
    console.log(user.name);
    $("#addUserModal").modal('hide');
}


function updateModal(showEmail, showInfo, showPassword, showConfirm, buttonText, title) {
	visibility("userEmailDiv", showEmail);
	visibility("userNameDiv", showInfo);
    visibility("userPhoneDiv", showInfo);
    visibility("userPasswordDiv", showPassword);
    visibility("confirmationCode", showConfirm);
    $("#modalFormButton").text(buttonText);
    $("#addUserModalLabel").text(title);
    $("#addUserModal").modal();
}

function toggleShowPassword(checkBoxId, inputId) {
    if ($("#" + checkBoxId).is(":checked")) {
        $("#" + inputId).prop("type", "text");
    } else {
        $("#" + inputId).prop("type", "password");
    }
}

function actionSignUp() {
    updateModal(true, true, true, false, "Sign Up", "Add a new user to the user pool");
}

function actionConfirmUser() {
    updateModal(true, false, false, true, "Confirm", "Confirm a new user");
}

function actionSignInUser() {
    updateModal(true, false, true, false, "Sign In", "Login user");
}

function actionSignOutUser() {
    let message = `user <i>${user.name}</i> signed out`;
    let callback = createCallback(message, user.email, user.name, user.phone, user.email_verified);
    signOutUser(callback);
}

function updateUserTable(attributes) {
    $("#userAttributesTableBody tr").remove();
    let table = document.getElementById("userAttributesTableBody");
    for (key in attributes) {
        let row = table.insertRow(-1);
        let nameCell = row.insertCell(0);
        nameCell.innerHTML = key;
        let valueCell = row.insertCell(1);
        valueCell.innerHTML = attributes[key];
    }
}

function updateTable(userInfo) {
    user.update(userInfo);
    $("#userNameCell").html(user.name);
    $("#userEmailCell").html(user.email);
    if (user.email_verified === "true") {
        $("#userConfirmedCell").html("Yes");
    } else {
        if (user.name) {
            $("#userConfirmedCell").html("No");
        } else {
            $("#userConfirmedCell").html("");
        }
    }

    updateUserTable(userInfo);
}