document.querySelector('#user-image-input').addEventListener('change', (evt) => {
    // console.log(evt.target.value);
    document.querySelector('#user-img-form').submit();
});

const contract_details_edit_btn = document.querySelector('#contract-details-edit-btn');
const contract_details_save_btn = document.querySelector('#contract-details-save-btn');

contract_details_edit_btn.addEventListener('click', (evt) => {
    evt.currentTarget.style.display = 'none';
    contract_details_save_btn.removeAttribute('style');
    const contract_input = document.querySelectorAll('form#profile-contract-details-form input');
    contract_input.forEach((input) => {
       input.disabled = false;
    });
});