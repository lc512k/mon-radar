const toast = document.querySelector('.mdl-js-snackbar');

initDialog = (res) => {
	toast.MaterialSnackbar.showSnackbar({
	    message: `${res.status} ${res.statusText}`
	});
};
