const dialog = document.querySelector('dialog');

const title = dialog.querySelector('.mdl-dialog__title');
const content = dialog.querySelector('.mdl-dialog__content');

dialog.querySelector('.close').addEventListener('click', () => {
   dialog.close();
});

const initDialog = (res) => {
	// TODO add all possibilities
	title.innerText = 'Server says:';
	content.innerText = `${res.status} ${res.statusText}`;
	dialog.showModal();
};
