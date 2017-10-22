const toast = document.querySelector('.mdl-js-snackbar');

module.exports = (res) => {
	toast.MaterialSnackbar.showSnackbar({
	    message: `${res.status} ${res.statusText}`
	});
};
