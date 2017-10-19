const dialog = document.querySelector('dialog');

const title = dialog.querySelector('.mdl-dialog__title');
const content = dialog.querySelector('.mdl-dialog__content');
const close = dialog.querySelector('.close');

close.addEventListener('click', () => {
   dialog.close();
});

initDialog = (res) => {
	// TODO add all possibilities
	title.innerText = 'Server says:';
	content.innerText = `${res.status} ${res.statusText}`;
	dialog.showModal();
};
