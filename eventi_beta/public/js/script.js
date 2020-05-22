
/* Open popup confirm delete event */
function confirmDelete() {

    document.getElementById('confirm-delete').classList.toggle('show');

    /* var confirm_delete = document.getElementById('confirm-delete');

    if(confirm_delete.style.visibility === 'hidden')
        confirm_delete.style.visibility = 'visible';
    else
        confirm_delete.style.visibility = 'hidden'; */
}

function confirmLogout() {

    document.getElementsByClassName('confirm-logout-form')[0].classList.toggle('show-form');
    document.getElementById('confirm-logout').classList.toggle('show-form-bg');
    /* var confirm_delete = document.getElementById('confirm-delete');

    if(confirm_delete.style.visibility === 'hidden')
        confirm_delete.style.visibility = 'visible';
    else
        confirm_delete.style.visibility = 'hidden'; */
}