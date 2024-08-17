//const confirmPlans = (function() {
const confirmPlans = (function () {
	/** global variable *******************/

	// The default address when the page is read.
	const DEFAULT_ADDRESS = "6 Southwark St, London SE1 1TQ Ingland";
	const LATITUDE = 51.505;
	const LONGITUDE = -0.09;
	const VIEW_ZOOM_LEVEL = 15;
	
	const HIDE_SORT_TRUE = true;
	const CLEAR_ROUTE_TRUE = true;
	
	/* delimiter */
	// colon for:
	// - search no. and place id
	const DELIMITER_COLON = ':';
	
	
	// -- spot-list recode number count
	let luggageCntNo = 0;

	// targeted geoLayer map
	var searchedGeoLayerMap = new Map();

	/** global variable end****************/
	
	const modifyLuggageRecordNo = (function() {
		var recordCnt = 1;
		$('#luggage-list-table tbody').find('.luggage-record-no').each(function() {
			$(this).children('input').val(recordCnt);
			$(this).text(recordCnt);
			recordCnt++;
		});
	});
	
	// method right before submit
	const beforeSubmit = (function() {
		$('input[id^="submit"]').click(function() {
			var url = '';

			if ($(this).attr('id') == 'submit') {
				// if the button is not submit button
				url = '/tripPlan/travel/tripPlans/createRoute/prepLuggage/confirmPlans/resultTripPlans';
			} else {
				if ($(this).attr('id') == 'submit-back') {
					// if the button is back button
					url = '/tripPlan/travel/tripPlans/createRoute/prepLuggage?back';
				}
			}
			// rewrite the action
			$('form').attr('action', url);				
			$('form').submit();
		});
	});
	
	const setEvent = (function() {
		modifyLuggageRecordNo();
		beforeSubmit();
	});
	
	$(function(){
		setEvent();
		$('#search-button').trigger('click');
		location.href="#";
	});
});

$(function(){
    confirmPlans();
});