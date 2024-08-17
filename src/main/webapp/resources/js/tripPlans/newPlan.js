const CREATE_ROUTE_NAV_HEIGHT = '150px';

const submitElm = document.getElementById('submit-createRoute');

toggleDisplayPlanKindNav();

function toggleDisplayCreateRouteNav() {
	var createRouteNav = document.getElementsByClassName('create-route-nav')[0];
	if (!createRouteNav.classList.contains("active")) {
		createRouteNav.classList.add('active');
	} else {
		createRouteNav.classList.remove('active');
		resetCreateRouteNav();
	}
}

function resetCreateRouteNav() {
	// clear the selected button of plan-kind
	(document.querySelectorAll('input[type="radio"][name="plan-kind"]')).forEach(
			planKindButton => planKindButton.checked = false);
	
	// clear the input text of new plan
	document.getElementById('newTripPlanName').value = '';
	
	// reset the 'create-route-nav' pane
	var createRrouteNavElm = document.getElementsByClassName('create-route-nav')[0];
	var newPlanNavElm = document.getElementsByClassName('new-plan-nav')[0];
	var existedPlanNameElm = document.getElementsByClassName('existed-plan-nav')[0];

	createRrouteNavElm.style.height = '30px';
	newPlanNavElm.classList.remove('active');
	existedPlanNameElm.classList.remove('active');
	
	// call toggleDisplayPlanKindNav
	toggleDisplayPlanKindNav();
}

submitElm.addEventListener('mouseover', () => {
	var disableSubmitFlg = toggleDisplayPlanKindNav();
	if (!disableSubmitFlg) {
		submitElm.style = 'background-color: #FFFF9D; color: #DC143C; border: 1px solid #000; cursor: pointer;';
	}
}, false);

submitElm.addEventListener('mouseleave', () => {
	var disableSubmitFlg = toggleDisplayPlanKindNav();
	if (!disableSubmitFlg) {
		submitElm.style = 'background-color: #FFFFDD; color: #000; border: 1px solid #000; cursor: pointer;';
	}
}, false);

function toggleDisplayPlanKindNav() {
	var planKindRadiobtns = document.querySelectorAll('input[type="radio"][name="plan-kind"]');
	disableButton('submit', true);
	var disableFlg = true;
	var checkedCount = 0;
	
	for (let radio of planKindRadiobtns) {
		if (radio.checked) {
			checkedCount++;
			var createRrouteNavElm = document.getElementsByClassName('create-route-nav')[0];
			var newPlanNavElm = document.getElementsByClassName('new-plan-nav')[0];
			var existedPlanNameElm = document.getElementsByClassName('existed-plan-nav')[0];
			
			if (radio.id == '1') {
				createRrouteNavElm.style.height = CREATE_ROUTE_NAV_HEIGHT;
				//existedPlanNameElm.style = 'opacity:0';
				existedPlanNameElm.classList.remove('active');
				if (!newPlanNavElm.classList.contains('active')) {
					newPlanNavElm.classList.add('active');
				}
				newPlanNavElm.style = '';

				document.getElementById('newTripPlanName').style.display = 'block';
				document.getElementById('existedTripPlanName').style.display = 'none';

				if (document.getElementById('newTripPlanName').value == '') {
					disableFlg = true;
				} else {
					disableFlg = false;
				}
			} else if (radio.id == '2') {
				//newPlanNavElm.style = 'opacity:0';
				newPlanNavElm.classList.remove('active');
				createRrouteNavElm.style.height = CREATE_ROUTE_NAV_HEIGHT;
				if (!existedPlanNameElm.classList.contains("active")) {
					existedPlanNameElm.classList.add("active")
				}
				existedPlanNameElm.style = '';
				
				document.getElementById('newTripPlanName').style.display = 'none';
				document.getElementById('existedTripPlanName').style.display = 'block';
				
				if (document.getElementById('existedTripPlanName').value == '') {
					disableFlg = true;
				} else {
					disableFlg = false;
				}
			}
			setSubmitButtonStyle(disableFlg);
			submitElm.style.display = 'block';			
		}	
	}
	if (checkedCount == 0) {
		// when none of the buttons are checked
		setSubmitButtonStyle(disableFlg);
	}
	
	return disableFlg;
}

function setSubmitButtonStyle(disableFlg) {
	if (disableFlg) {
		submitElm.style = 'background-color: #ccc8c8; color: #808080; border: 1px solid #808080; cursor: not-allowed;';
	} else {
		submitElm.style = 'background-color: #FFFFDD; color: #000; border: 1px solid #000; cursor: pointer;';
	}
	disableButton('submit', disableFlg);
}

function disableButton(buttonKind, disableFlg) {
	if (buttonKind == 'submit') {
		document.getElementById('submit-createRoute').disabled = disableFlg;
	}
}

// when the input text changes
function onInput(){
	toggleDisplayPlanKindNav();
}

function beforeSubmit(url) {
	
	$('form').attr('action', url);
	$('form').submit();
	
}

const newPlan = (function () {
	/** global variable *******************/

	// The default address when the page is read.
	const DEFAULT_ADDRESS = "6 Southwark St, London SE1 1TQ Ingland";
	const LATITUDE = 51.505;
	const LONGITUDE = -0.09;
	const VIEW_ZOOM_LEVEL = 15;
	
	// Bag No List
	const BAG_NO_ARRY = ["-", "01", "02"];
	
	// - param : trElm  TR element 
	const rewriteFormIndexes = (function(trElm, infoIndex, itemIndex) {
		var targetTdElms = trElm.children('[id^="luggage-"]').children('[id^="luggageInfoList"]');
		targetTdElms.each(function() {
			var id = $(this).attr('id');
			var idFirstPt = id.substring(0, id.indexOf('.') - 1);
			var idSecondPt = id.substring(id.indexOf('.') + 1, id.length);
			var idThirdPt = null;
			if (idSecondPt.indexOf('.') != 0) {
				idThirdPt = idSecondPt.substring(idSecondPt.indexOf('.') + 1, idSecondPt.length);
				idSecondPt = idSecondPt.substring(0, idSecondPt.indexOf('.') - 1);
			}
			
			var newId = idFirstPt + infoIndex + '.' + idSecondPt;
			newId = idThirdPt != null ? newId + itemIndex + '.' + idThirdPt : newId;			
			
			var newName = idFirstPt + '[' + infoIndex + '].' + idSecondPt;
			newName = idThirdPt != null ? newName + '[' + itemIndex + '].' + idThirdPt : newName;	
			
			$(this).attr('id', newId);
			$(this).attr('name', newName);
		});
	});
	
	// method right before submit
	const beforeSubmit = (function() {
		$('form').submit(function() {

		});
	});

	const setEvent = (function() {
	});
	
	$(function(){
		setEvent();
		$('#search-button').trigger('click');
		location.href="#";
	});
});

$(function(){
	newPlan();
});