
if(!$('#email').val() || !$('#mobile').val() || !$('#dob').val() || !$('#aboutMe').val())
    $('#viewProfile').click();

var addError = (field, message) => {
    field.html(message);
    field.addClass('text-danger')
    field.removeClass('d-none');

    return true;
}

var removeError = (field) => {
    field.html('');
    field.removeClass('text-danger');
    field.addClass('d-none');
}

var editChanges = () => {
	$('#userName').removeAttr('readonly').removeClass('form-control-plaintext').addClass('form-control');
	$('#fullName').removeAttr('readonly').removeClass('form-control-plaintext').addClass('form-control');
	$('#dob').removeAttr('readonly').removeClass('form-control-plaintext').addClass('form-control');
	$('#email').removeAttr('readonly').removeClass('form-control-plaintext').addClass('form-control');
	$('#mobile').removeAttr('readonly').removeClass('form-control-plaintext').addClass('form-control');
	$('#aboutMe').removeAttr('readonly').removeClass('form-control-plaintext').addClass('form-control');

	$('#editChanges').addClass('d-none');
	$('#saveChanges').removeClass('d-none');
	$('#cancelChanges').removeClass('d-none');
    $('#profileInfoMessage').html('').removeClass('text-success text-danger').addClass('d-none');

    removeError($('#editUserNameMessage'));
    removeError($('#editFullNameMessage'));
    removeError($('#editDOBMessage'));
    removeError($('#editEmailMessage'));
    removeError($('#editMobileMessage'));
};

var cancelChanges = () => {
	$('#userName').attr('readonly', 'true').addClass('form-control-plaintext').removeClass('form-control');
	$('#fullName').attr('readonly', 'true').addClass('form-control-plaintext').removeClass('form-control');
	$('#dob').attr('readonly', 'true').addClass('form-control-plaintext').removeClass('form-control');
	$('#email').attr('readonly', 'true').addClass('form-control-plaintext').removeClass('form-control');
	$('#mobile').attr('readonly', 'true').addClass('form-control-plaintext').removeClass('form-control');
	$('#aboutMe').attr('readonly', 'true').addClass('form-control-plaintext').removeClass('form-control');

	$('#editChanges').removeClass('d-none');
	$('#saveChanges').addClass('d-none');
	$('#cancelChanges').addClass('d-none');
    $('#profileInfoMessage').html('').removeClass('text-success text-danger').addClass('d-none');

    removeError($('#editUserNameMessage'));
    removeError($('#editFullNameMessage'));
    removeError($('#editDOBMessage'));
    removeError($('#editEmailMessage'));
    removeError($('#editMobileMessage'));
};

var saveChanges = () => {
    var userName = $('#userName').val();
    var fullName = $('#fullName').val();
    var dob = $('#dob').val();
    var email = $('#email').val();
    var mobile = $('#mobile').val();
    var aboutMe = $('#aboutMe').val();

    var userNameMessage = $('#editUserNameMessage');
    var fullNameMessage = $('#editFullNameMessage');
    var dobMessage = $('#editDOBMessage');
    var emailMessage = $('#editEmailMessage');
    var mobileMessage = $('#editMobileMessage');
    var generalInfoMeesage = $('#generalInfoMeesage');

    removeError(userNameMessage);
    removeError(fullNameMessage);
    removeError(dobMessage);
    removeError(emailMessage);
    removeError(mobileMessage);
    removeError(generalInfoMeesage);

    var hasError = false;
    
    if(!userName)
        hasError = addError(userNameMessage, 'Username is required!');
    if(!fullName)
        hasError = addError(fullNameMessage, 'Fullname is required!');
    if(dob) {
        date = dob.split('-');
        if(isNaN(Date.parse(date[2] + "-" + date[1] + "-" + date[0])))
            hasError = addError(dobMessage, 'Date of Birth should be DD-MM-YYYY');
    }
            
    if(email && email !== 'None' && !(/\S+@\S+\.\S+/).test(email)) 
        hasError = addError(emailMessage, 'Invalid email!');
    if(mobile && mobile !== 'None' && !(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(mobile)))
        hasError = addError(mobileMessage, 'Invalid mobile!');

    if(hasError) return false;

	$.ajax({
		url		: '/save-user-info',
		type	: 'PUT',
		data	: JSON.stringify({
			userName	: userName,
			fullName	: fullName,
			dob			: dob,
			email		: email,
			mobile		: mobile,
		    aboutMe		: aboutMe
        }),
		success	: (response) => {
            cancelChanges();
            $('#_aboutMe, #aboutMe').html(aboutMe);
            $('#_fullName, #fullName').html(fullName);
			$('#profileInfoMessage').html(response).addClass('text-success').removeClass('text-danger d-none');
        },
		error	: (response) => {
			$('#profileInfoMessage').html(response['responseText']).addClass('text-danger').removeClass('text-success d-none');
		}
    });
};

var changePassword = (event) => {
    event.preventDefault();

    var oldPassword = $('#oldPassword').val();
    var newPassword = $('#newPassword').val();
    var confirmNewPassword = $('#confirmNewPassword').val();
    var oldPasswordMessage = $('#oldPasswordMessage');
    var newPasswordMessage = $('#newPasswordMessage');
    var confirmNewPasswordMessage = $('#confirmNewPasswordMessage');
    var generalMessage = $('#changePasswordGeneralMessage');

    removeError(oldPasswordMessage);
    removeError(newPasswordMessage);
    removeError(confirmNewPasswordMessage);
    removeError(generalMessage);

    var hasError;

    if(!oldPassword)
        hasError = addError(oldPasswordMessage, 'Old password is required!');
    else if(oldPassword.length < 6)
        hasError = addError(oldPasswordMessage, 'Old password should be at least 6 characters!');
    else if(oldPassword.search(/[a-z]/) < 0)
        hasError = addError(oldPasswordMessage, 'Old password should contains at least one lowercase leter!');
    else if(oldPassword.search(/[A-Z]/) < 0)
        hasError = addError(oldPasswordMessage, 'Old password should contains at least one uppercase letter!');
    else if(oldPassword.search(/[0-9]/) < 0)
        hasError = addError(oldPasswordMessage, 'Old password should contains at least one number');
    else if(oldPassword.search(/[!@#$%^&*]/) < 0)
        hasError = addError(oldPasswordMessage, 'Old password should contains at least one special character!');

    if(!newPassword)
		hasError = addError(newPasswordMessage, 'New password is required!');
	else if(newPassword.length < 6)
        hasError = addError(newPasswordMessage, 'New password should be at least 6 characters!');
    else if(newPassword.search(/[a-z]/) < 0)
        hasError = addError(newPasswordMessage, 'New password should contains at least one lowercase leter!');
    else if(newPassword.search(/[A-Z]/) < 0)
        hasError = addError(newPasswordMessage, 'New password should contains at least one uppercase letter!');
    else if(newPassword.search(/[0-9]/) < 0)
        hasError = addError(newPasswordMessage, 'New password should contains at least one number');
    else if(newPassword.search(/[!@#$%^&*]/) < 0)
        hasError = addError(newPasswordMessage, 'New password should contains at least one special character!');

    if(!confirmNewPassword)
        hasError = addError(confirmNewPasswordMessage, 'Confirm new password is required!');
    else if(confirmNewPassword !== newPassword)
        hasError = addError(confirmNewPasswordMessage, 'Confirm new password must match with the new password!');

    if(oldPassword === newPassword)
        hasError = addError(newPasswordMessage, 'Old password and new passwords are the same!')

    if(hasError) return false;

    $.post({
        url         : '/change-password',
        data        : JSON.stringify({
            'oldPassword'   : oldPassword,
            'newPassword'   : newPassword
        }),
        success     : (response) => {
            removeError(generalMessage);
            $('#oldPassword, #newPassword, #confirmNewPassword').val('');
            generalMessage.html(response).removeClass('d-none text-danger').addClass('text-success');
        },
        error       : (response) => {
            generalMessage.html(response['responseText']).addClass('text-danger').removeClass('d-none text-success');
        }
    })
}

var logout = () => {
    setTimeout(() => {
        $.get('/logout', () => {location.replace("/");});
    }, 1000);
}

$('#uploadProfilePic').change((event) => {
    var formData = new FormData();
    formData.append('file', event.target.files[0]);
    $.ajax({
        url         : '/upload-profile-pic',
        type        : 'POST',
        data        : formData,
        contentType : false,
        processData : false,
        success     : (response) => {
            $('#_profilePic').attr('src', response);
            $('#profilePic').attr('src', response);
        }
    });
});

var updateProfilePic = (option) => {
    if('change' === option || 'upload' === option) {
        $('#uploadProfilePic').click();
        return false;
    }
    $.get('/delete-profile-pic', () => {
            $('#_profilePic').attr('src', '/static/images/defaultProfilePic.jpeg');
            $('#profilePic').attr('src', '/static/images/defaultProfilePic.jpeg');
        });
}

var postDairy = (event) => {
    event.preventDefault();

    var subject = $('#subject').val();
    var text = $('#text').val();
    var generalMessage = $('#postDairyGeneralMessage');

    removeError(generalMessage);

    if(!subject && !text) {
        addError(generalMessage, 'Either subject and/or dairy required!');
        return false;
    }

    $.post({
        url     : '/post-dairy',
        data    : JSON.stringify({
            subject : subject,
            text    : text
        }),
        success : (response) => {
            response = JSON.parse(response);
            var mainDiv = $('#' + response['postedOnDate']);
            if(!mainDiv.length) {
                mainDiv = $('<div class="border border-info mb-2 p-3" id="' + response['postedOnDate'] + '"></div>');
                mainDiv.append(
                    '<h5 class="text-dark">Dairy posted on\
                        <span class="text-info"> : ' + response['postedOnDate'] + '</span>\
                    </h5>'
                );
                $('#dairies').prepend(mainDiv);
            }
            $('#' + response['postedOnDate'] + ' > h6').after(
                '<div class="card mb-1 border-muted">\
                    <div class="card-body">\
                        <div class="card-title text-info"> ' + response['subject'] + '</div>\
                        <div class="card-subtitle text-muted float-right">\
                                ' + response['postedOnDate'] + ' ' + response['postedOnTime'] + '\
                            </div>\
                            <div class="card-text">\
                                <pre class="text-secondary">' + response['text'] + '</pre>\
                            </div>\
                        </div>\
                    </div>');
            $('#subject, #text').val('');
        },
        error   : (response) => {
            alert('error');
            addError(generalMessage, response['responseText']);
        }
    })

    return false;
}

$(document).ready(() => {
    var viewPosts = (date) => {
        $.get('/dairies?date=' + date, (response) =>{
            response = JSON.parse(response);
            $('#postsTitle').html(
                '<h6 class="text-dark">Viewing for the date: \
                    <span class="text-info">' + date + '</span>\
                </h6>'
            );
    
            if(!response || !response.length) {
                $('#posts').append('<p class="text-muted>You don\'t have any posts on this date</p>');
                return;
            }

            for(var i = 0; i < response.length; i++) {
                $('#posts').append(
                    '<div class="card mb-1 border-muted">\
                        <div class="card-body">\
                            <div class="card-title text-info"> ' + response[i]['subject'] + '</div>\
                            <div class="card-subtitle text-muted float-right">\
                                ' + response[i]['postedOnDate'] + ' ' + response[i]['postedOnTime'] + '\
                            </div>\
                            <div class="card-text">\
                                <pre class="text-secondary">' + response[i]['text'] + '</pre>\
                            </div>\
                        </div>\
                    </div>'
                );
            }
        });
    };

    $('button[id*="viewPostsFor_"]').click((e) => {
        $('#posts, #postsTitle').html('');
        $('#viewPostsModalBtn').click();
        viewPosts($('#_dateFor' + $(e.currentTarget).attr('id')).val());
    });

    $('#selectDates').change((e) => {
        $('#posts, #postsTitle').html('');
        viewPosts($(e.currentTarget).val());
    });

})();