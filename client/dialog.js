const toast = document.querySelector('.mdl-js-snackbar');

module.exports = (res) => {
	console.log('[TOAST]', toast);

	console.log('[TOAST]', toast.MaterialSnackbar);
	toast.MaterialSnackbar.showSnackbar({
	    message: `${res.status ? res.status : ''} ${res.statusText ? res.statusText : ''}`
	});
};
