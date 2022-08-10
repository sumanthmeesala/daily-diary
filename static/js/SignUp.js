var addError = (field, message) => {
    field.html(message);
    field.addClass('text-danger');
    field.removeClass('d-none');

    return true;
}

var removeError = (field) => {
    field.html('');
    field.removeClass('text-danger');
    field.addClass('d-none');
}

var register = (event) => {
    var fullName = $('#fullName').val()
    var userName = $('#userName').val();
    var password = $('#password').val();
    var confirmPassword = $('#confirmPassword').val();
    var fullNameMessage = $('#fullNameMessage');
    var userNameMessage = $('#userNameMessage');
    var passwordMessage = $('#passwordMessage');
    var confirmPasswordMessage = $('#confirmPasswordMessage');

    removeError(fullNameMessage);
    removeError(userNameMessage);
    removeError(passwordMessage);
    removeError(confirmPasswordMessage);
    removeError($('#generalError'))

    var hasErrors = false;

    if(!fullName)
        hasErrors = addError(fullNameMessage, "Fullname is required!")
    if(!userName)
        hasErrors = addError(userNameMessage, 'Username is required!');
    if(!password)
        hasErrors = addError(passwordMessage, 'Password is required!');
    else if(password.length < 6)
        hasErrors = addError(passwordMessage, 'Password should be at least 6 characters!');
    else if(password.search(/[a-z]/) < 0)
        hasErrors = addError(passwordMessage, 'Password should contains at least one lowercase leter!');
    else if(password.search(/[A-Z]/) < 0)
        hasErrors = addError(passwordMessage, 'Password should contains at least one uppercase letter!');
    else if(password.search(/[0-9]/) < 0)
        hasErrors = addError(passwordMessage, 'Password should contains at least one number');
    else if(password.search(/[!@#$%^&*]/) < 0)
        hasErrors = addError(passwordMessage, 'Password should contains at least one special character!')
    if(!confirmPassword)
        hasErrors = addError(confirmPasswordMessage, "Confirm Password is required!");
    else if(confirmPassword !== password)
        hasErrors = addError(confirmPasswordMessage, "Confirm Password is not matching with the Password");

    if(hasErrors) event.preventDefault();
}
