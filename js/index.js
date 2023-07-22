document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    fetchContacts();
}

function fetchContacts() {
    var options = new ContactFindOptions();
    options.filter = '';
    options.multiple = true;
    var fields = ['displayName', 'phoneNumbers', 'emails'];
    navigator.contacts.find(fields, onContactsSuccess, onContactsError, options);
}

function onContactsSuccess(contacts) {
    var contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    contacts.forEach(function (contact) {
        var contactCard = document.createElement('div');
        contactCard.classList.add('col-md-4', 'mb-4');

        var cardBody = document.createElement('div');
        cardBody.classList.add('card', 'text-center');

        var cardContent = document.createElement('div');
        cardContent.classList.add('card-body');

        var contactName = document.createElement('h5');
        contactName.classList.add('card-title');
        contactName.textContent = contact.displayName;

        var phoneNumber = document.createElement('p');
        phoneNumber.classList.add('card-text');
        if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
            phoneNumber.textContent = 'Phone: ' + contact.phoneNumbers[0].value;
        } else {
            phoneNumber.textContent = 'Phone: N/A';
        }

        var email = document.createElement('p');
        email.classList.add('card-text');
        if (contact.emails && contact.emails.length > 0) {
            email.textContent = 'Email: ' + contact.emails[0].value;
        } else {
            email.textContent = 'Email: N/A';
        }

        cardContent.appendChild(contactName);
        cardContent.appendChild(phoneNumber);
        cardContent.appendChild(email);
        cardBody.appendChild(cardContent);
        contactCard.appendChild(cardBody);

        // Add click event to show contact details in a modal
        contactCard.addEventListener('click', function () {
            displayContactDetails(contact);
        });

        contactList.appendChild(contactCard);
    });
}

function onContactsError(error) {
    alert('Error fetching contacts: ' + error);
}

function displayContactDetails(contact) {
    // Create a modal to display contact details
    var modal = '<div class="modal fade" id="contactModal" tabindex="-1" role="dialog" aria-labelledby="contactModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog modal-dialog-centered" role="document">';
    modal += '<div class="modal-content">';
    modal += '<div class="modal-header">';
    modal += '<h5 class="modal-title" id="contactModalLabel">' + contact.displayName + '</h5>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
    modal += '<span aria-hidden="true">&times;</span>';
    modal += '</button>';
    modal += '</div>';
    modal += '<div class="modal-body">';
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
        modal += '<p>Phone: ' + contact.phoneNumbers[0].value + '</p>';
    } else {
        modal += '<p>Phone: N/A</p>';
    }
    if (contact.emails && contact.emails.length > 0) {
        modal += '<p>Email: ' + contact.emails[0].value + '</p>';
    } else {
        modal += '<p>Email: N/A</p>';
    }
    modal += '</div>';
    modal += '<div class="modal-footer">';
    modal += '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
    modal += '</div>';
    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    // Append the modal to the body and show it
    document.body.insertAdjacentHTML('beforeend', modal);
    $('#contactModal').modal('show');
}

function saveNewContact() {
    var newContactName = document.getElementById('newContactName').value;
    var newContactPhoneNumber = document.getElementById('newContactPhoneNumber').value;
    var newContactEmail = document.getElementById('newContactEmail').value;

    var contact = navigator.contacts.create();
    contact.displayName = newContactName;
    contact.name = new ContactName();
    contact.name.formatted = newContactName;
    if (newContactPhoneNumber) {
        contact.phoneNumbers = [new ContactField('mobile', newContactPhoneNumber, true)];
    }
    if (newContactEmail) {
        contact.emails = [new ContactField('work', newContactEmail, true)];
    }

    contact.save(function (savedContact) {
        alert('New contact saved successfully!');
        // Clear the input fields
        document.getElementById('newContactName').value = '';
        document.getElementById('newContactPhoneNumber').value = '';
        document.getElementById('newContactEmail').value = '';

        // Refresh the contact list
        fetchContacts();
    }, function (error) {
        alert('Error saving new contact: ' + error);
    });
}
