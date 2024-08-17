export const modalConfirmEmptyEnter = (function(val) {
	
	$('#confirm-empty-enter-val').val(val);
	
	if (val == "0") {
		return true;
	} else {
		return false;
	}
});
