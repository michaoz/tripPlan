import {modalConfirmEmptyEnter} from "../modalConfirmEmptyEnter.js"

const createRoute = (function () {
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
	let spotCntNo = 0;
	// map
	var map = L.map('mapContainer');
	
	/* pointGeoLayerGroup
	 * : GeoLayerGroup marked on the map
	 *  - contents: (data.place_id, geoLayer._layers[geoLayer._leaflet_id - 1])
	 */ 
	var pointGeoLayerGroup = new L.layerGroup();	
	var lineGeoLayerGroup = new L.layerGroup();
	// targeted geoLayer map
	var pointedGeoLayerMap = new Map();
	var searchedGeoLayerMap = new Map();
	// var routeGeoLayerList = new Array();

	/** global variable end****************/
	
	/**
	 * create searched-result records
	 */
	const createSearchResultRecord = (function(jsonResultData, recordNum) {
		var searchedGeoLayer = pointedGeoLayerMap.get(jsonResultData["place_id"]);
		if (searchedGeoLayer == undefined) {
			searchedGeoLayer = searchedGeoLayerMap.get(jsonResultData["place_id"]);			
		}
		var searchedLeafletId = 0;
		if (searchedGeoLayer != null) {
			searchedLeafletId = searchedGeoLayer._leaflet_id + 1;
		}
		var pointLeafletId = searchedLeafletId;
		
		let tdNo = '<td class="js-search-result-record-no' + jsonResultData["place_id"] + '-' + recordNum 
		           + ' css-search-result-record-no">' + recordNum + '</td>';
		let tdAddress = '<td class="js-search-result-address">' + jsonResultData["display_name"] + '</td>';
		let tdLatLon = '<td style="display: none" class="js-search-result-lanlon">' + jsonResultData["lat"] + '_' + jsonResultData["lon"] + '</td>';
		let tdLeafletId = '<td style="display: none" class="js-search-result-leafletid">' + searchedLeafletId + '_' + pointLeafletId + '</td>';
		let tdAddButton = '<td id="css-search-result-button-td">'
			+ '<button type="button" '
			+ 'name="' + jsonResultData["place_id"] + '"'
			+ ' class="js-search-result-button-' + jsonResultData["place_id"] 
		    + ' css-search-result-button"'
	        + ' value="' + jsonResultData["place_id"]
            + '"></button></td>';
            
		var tbody = '<tbody>'
			    + '<tr>'
		        + tdNo
			    + tdAddress
			    + tdLatLon
			    + tdLeafletId
			    + tdAddButton
			    + '</tr>'
			    + '</tbody>';
		return tbody;
	});

	/**
	 * create spot list records
	 */
	const createSpotListRecord = (function(recordNum, addressText, spotNoPlaceId, latLonText, pointLeafletId) {
		recordNum++;
		
		var searchedGeoLayer = pointedGeoLayerMap.get(Number(spotNoPlaceId.split(DELIMITER_COLON)[1]));
		if (searchedGeoLayer == undefined) {
			searchedGeoLayer = searchedGeoLayerMap.get(Number(spotNoPlaceId.split(DELIMITER_COLON)[1]));
		}
		var searchedLeafletId = 0;
		if (searchedGeoLayer != null) {
			searchedLeafletId = searchedGeoLayer._leaflet_id + 1;
		}
		if (pointLeafletId == undefined || pointLeafletId == null) {
			pointLeafletId = searchedLeafletId;
		}
		
		const addressNumPattern = /^\d+$|^\d+-\d+/;
		let addressNumIdx = 0;
		let spotName, city, address = '';
		// アドレスをカンマで区切って配列にする: make an array dividing the address by comma.
		if (addressText) {
			var adressList = addressText.split(/,/);
			
			/* set Spot List's columns */
			// Spot Name
			spotName = adressList[0].replace(/\s+/g, '');
			
			// City Name
			city = adressList[adressList.length - 2].replace(/\s+/g, '') 
			                   ? adressList[adressList.length - 2].replace(/\s+/g, '')
			        		   : '';  // if it's undefined
			// search numbers and make a list
			var matchedList = adressList.filter(
					x => addressNumPattern.test(x.replace(/\s+/g, '')));
			if (matchedList.length != 0) {
				var addressNum = matchedList.sort(
						(y1, y2) => adressList.indexOf(y1) - adressList.indexOf(y2))[0];
				addressNumIdx = adressList.indexOf(addressNum);
			}
			if (addressNumIdx > 0) {
				city = adressList[addressNumIdx - 1].replace(/\s+/g, '')
				           ? adressList[addressNumIdx - 1].replace(/\s+/g, '')
				           : '';  // if it's undefined
			}
			
			// Address
			// delete blanks from the texts
			address = addressText.replace(/\s+/g, '');
		}	
		
		var tdNo = '<td id="spot-list-record-no-' + spotNoPlaceId + '" >'
	               + '<input id="spotList' + (recordNum - 1) + '.recordNum" name="spotList[' + (recordNum - 1) + '].recordNum"'
                   + ' type="hidden" value="' + recordNum + '">'
                   + recordNum
		           + '</td>';
		var tdSortLeader = '<td><span></span></td>';
		var tdSpotName = '<td id="spot-list-record-content-spotName-' + spotNoPlaceId + '">' 
                     + '<input id="spotList' + (recordNum - 1) + '.spotName" name="spotList[' + (recordNum - 1) + '].spotName"'
                     + ' type="hidden" value="' + spotName + '">'
                     + spotName
		             + '</td>';
		var tdCity = '<td id="spot-list-record-content-city-' + spotNoPlaceId + '">' 
                     + '<input id="spotList' + (recordNum - 1) + '.city" name="spotList[' + (recordNum - 1) + '].city"'
                     + ' type="hidden" value="' + city + '">'
		             + city 
		             + '</td>';
		var tdAddress = '<td id="spot-list-record-content-address-' + spotNoPlaceId + '">'
		                + '<input id="spotList' + (recordNum - 1) + '.address" name="spotList[' + (recordNum - 1) + '].address"'
                        + ' type="hidden" value="' + address + '">'
                        + address
		                + '</td>';
		var latLon = '<td style="display: none" id="spot-list-record-content-latLon-' + spotNoPlaceId + '">'
                     + '<input id="spotList' + (recordNum - 1) + '.latLon" name="spotList[' + (recordNum - 1) + '].latLon"'
                     + ' type="hidden" value="' + latLonText + '">'
		             + latLonText 
		             + '</td>';
		var tdLeafletId = '<td style="display: none" id="spot-list-record-content-leafletId">' 
			              + '<input id="spotList' + (recordNum - 1) + '.leafletId" name="spotList[' + (recordNum - 1) + '].leafletId"'
		                  + ' type="hidden" value="' + searchedLeafletId + '_' + pointLeafletId + '_' + spotNoPlaceId + '">'
			              + searchedLeafletId + '_' + pointLeafletId + '_' + spotNoPlaceId 
			              + '</td>';	
        var tdEmitChbox = '<td>' 
        	              + '<input type="checkbox" id="spot-list-record-content-emit-' + spotNoPlaceId + '" '
                          + 'class="css-list-chbox" value=' + spotNoPlaceId + '>'
                          + '<label for="spot-list-record-content-emit-' + spotNoPlaceId + '" class="css-list-chbox-label">✓</label>'
        	              + '</td>';

		var tr = '<tr id="' +  recordNum + '">'  
			+ tdSortLeader
			+ tdEmitChbox
			+ tdNo 
			+ tdSpotName 
			+ tdCity 
			+ tdAddress
			+ latLon
			+ tdLeafletId
			+ '</tr>';

		return tr;
	});

	/**
	 * create delete list records
	 */
	const createDeleteListRecord = (function(recordNum, target, spotNoPlaceId, pLeafletId) {
		recordNum++;

		var searchedGeoLayer = pointedGeoLayerMap.get(Number(spotNoPlaceId.split(DELIMITER_COLON)[1]));
		var searchedLeafletId = 0;
		if (searchedGeoLayer != null) {
			searchedLeafletId = searchedGeoLayer._leaflet_id + 1;
		}
		if (pLeafletId == undefined) {
			pLeafletId = searchedLeafletId;
		}
		
		var spotName = target.children('td[id^="spot-list-record-content-spotName-"]')[0].textContent;
		var city = target.children('td[id^="spot-list-record-content-city-"]')[0].textContent;
		var address = target.children('td[id^="spot-list-record-content-address-"]')[0].textContent;
		var latLon = target.children('td[id^="spot-list-record-content-latLon-"]')[0].textContent;

		var tdNo = '<td id="delete-list-record-no-' + spotNoPlaceId + '" >' + recordNum + '</td>';
		var tdSpotName = '<td id="delete-list-record-content-spotName-' + spotNoPlaceId + '">' 
		                 + spotName + '</td>';
        var tdCity = '<td style="display: none" id="delete-list-record-content-city-' + spotNoPlaceId + '">'
                     + city + '</td>';
        var tdAddress = '<td style="display: none" id="delete-list-record-content-address-' + spotNoPlaceId + '">'
                        + address + '</td>';
        var tdLatLon = '<td style="display: none" id="delete-list-record-content-latLon-' + spotNoPlaceId + '">'
                        + latLon + '</td>';
		var tdLeafletId = '<td style="display: none" id="delete-list-record-content-leafletid">' + searchedLeafletId + '_' + pLeafletId + '_' + spotNoPlaceId + '</td>';
		var tdAddChbox = '<td>' + '<input type="checkbox" id="delete-list-record-content-emit-' + spotNoPlaceId + '" '
		            + 'class="css-list-chbox" value=' + spotNoPlaceId + '>'
	                + '<label for="delete-list-record-content-emit-' + spotNoPlaceId + '" class="css-list-chbox-label">✓</label>'
		            + '</td>';
		
		      
		var tbody = '<tbody id="" >' 
			+ tdAddChbox
			+ tdNo
			+ tdSpotName
			+ tdCity
			+ tdAddress
			+ tdLatLon
			+ tdLeafletId
			+ '</tbody>';
		
		return tbody;
	});

	/**
	 * add record to the spot list when the button's clicked
	 */
	const addSpotListRecode = (function() {
		$('.js-add-recode').click(function() {
			var spotListRecordNo = Number($('td[id^="spot-list-record-no"]').last().text().replace(/\s+/g, ''));
			if (!spotListRecordNo) {
				spotListRecordNo = 0;
			}
			var tr = createSpotListRecord(spotListRecordNo, null, null, null);
			$('#spot-list-table').append(tr);  // $('table[id="spot-list-table"]').append(tbody);

		});
	});

	/**
	 * send records to delete list:
	 * - send the checked recode to the delete list when the button's clicked
	 */
	const sendToDeleteList = (function() {
		$('.js-to-delete-list').click(function() {
			// hide the sort pane and clear the route on map
			commonClear(HIDE_SORT_TRUE, CLEAR_ROUTE_TRUE);
			
			var spotRecodeList = $('[id^="spot-list-record-content-emit-"]');
			var deleteTrList = new Array();
			spotRecodeList.each(function() {
				if($(this).prop('checked')) {
					var targetTr = $(this).closest('tr');
					// add to the delete target list
					deleteTrList.push(targetTr);
				}
			});
			$.each(deleteTrList, function(idx, deleteTargetTr) {
				// delete the elm from the spot list
				var deletedTarget = delHtml(deleteTargetTr);
				delHtml(deleteTargetTr.closest('tbody'));
				
				var deleteListRecordNo = $('td[id^="delete-list-record-no"]').last().text();
				if (!deleteListRecordNo) {
					deleteListRecordNo = 0;
				}
				// Get placeId
				var deletedTds = Array.from(deletedTarget[0].children);  // HTMLCOllectionを配列に変換
				var deletedTd = deletedTds.filter(tdElm => tdElm.id.startsWith('spot-list-record-no-'));
				var placeId = deletedTd[0].id.substring(
						deletedTd[0].id.lastIndexOf('-', deletedTd[0].id.length) + 1
						, deletedTd[0].id.length
						);  // id part=placeId
				var pLeafletId = deletedTds.filter(tdElm => tdElm.id.startsWith('spot-list-record-content-leafletId'))[0].textContent.split('_')[1];
				
				var tbody = createDeleteListRecord(deleteListRecordNo, deletedTarget, placeId, pLeafletId);
				addHtml($('#delete-list-table'), tbody);
			});
			
			// reassign numbers to the recodes
			var spotRecodeNumTds = $('td[id^=spot-list-record-no-]');
			
			// reassign recode No
			spotRecodeNumTds.sort(function(a, b) {
				if (Number(a.textContent) < Number(b.textContent)) {
					return -1;
				} else {
					return 1;
				}
			});	
			$.each(spotRecodeNumTds, function(idx, td) {
				// clear the td's content
				$(this).text('');
				delHtml($(this).children());
				
				var newElm = '<input id="spotList' + ((idx + 1) - 1) + '.recordNum" name="spotList[' + ((idx + 1) - 1) + '].recordNum"'
                             + ' type="hidden" value="' + (idx + 1) + '">'
				             + (idx + 1);
				addHtml($(this), newElm);
				td.parentElement.id = td.textContent;
			});
			
			// remove its marker from the map
			var newLayersFeatureList = new Array();  // a list for new layers' features
			var pointGeoLayers = $.extend({}, pointGeoLayerGroup._layers);
			pointGeoLayerGroup.clearLayers();
			
			let mapIdx = 0;
			for (var pLeafletId in pointGeoLayers) {
				var newLayerFlg = true;  // create a new layer: true / false
				
				// get info of pointGeoLayer
				var pointGeoLayer = pointGeoLayers[pLeafletId];
				
				var lat = pointGeoLayer._layers[pLeafletId - 1]._latlng.lat;
				var lon = pointGeoLayer._layers[pLeafletId - 1]._latlng.lng;
					
				// get info of deleted layer
				for (let i = 0; i < deleteTrList.length; i++) {
					var targetDeleteTd = deleteTrList[i].children('[id^="spot-list-record-content-latLon-"]');
					var deleteLatLon = deleteTrList[i].children('[id^="spot-list-record-content-latLon-"]').children('[id$=".latLon"]').val();
					var deleteLat = deleteLatLon.split("_")[0];
					var deleteLon = deleteLatLon.split("_")[1];
					var deleteLeafletId = deleteTrList[i].children('[id^="spot-list-record-content-leafletId"]').children('[id$=".leafletId"]').val();
					deleteLeafletId = deleteLeafletId.split('_')[1];
					
					// remove the layer if it's the delete target
					if (lat == Number(deleteLat) && lon == Number(deleteLon) && pLeafletId == Number(deleteLeafletId)) {
						newLayerFlg = false;
						break;
					}					
				}
				if (newLayerFlg) {
//					newLayersFeatureList.push(pointGeoLayer._layers[pLeafletId - 1].feature);				
					newLayersFeatureList.push(pointGeoLayer._layers[pLeafletId - 1]);
					mapIdx++;
				} else {
					// Maybe unnecessary to delete from pointedGeoLayerMap if it only goes to the delete list.
//					pointedGeoLayerMap.delete(Array.from(pointedGeoLayerMap.keys())[mapIdx])
				}
			}
			if (newLayersFeatureList.length > 0) {
				$('[id="spot-list-record-content-leafletId"]').each(function() {
					var searchedLeafletId = $(this).text().split('_')[0].replace(/\s+/g, '');
					var pointLeafletId = $(this).text().split('_')[1].replace(/\s+/g, '');

					// register a new layers
					$.each(newLayersFeatureList, function(idx, newLayer){
						if (pointLeafletId == newLayer._leaflet_id + 1) {
							controlGeoInfo(newLayer.feature, null, null, null, searchedLeafletId, false);
						}
					});
				});
				
			}			
		});
	});
	
	/**
	 * Sync PointGeoLayer leaflet_id on HTML when the layers on map were edited
	 */
	const syncPLeafletIdOnHtml = (function(pLeafletId, geoLayer, fistDisplayFlg) {
		$('[id = "spot-list-record-content-leafletId"]').each(function() {
			var leafletIdText = $(this).text().replace(/\s+/g, '');
			if (leafletIdText.split('_')[0] == (pLeafletId)) {
				var newLeafletIdTextFirst = '';
				if (fistDisplayFlg) {
					newLeafletIdTextFirst = geoLayer._leaflet_id;
				} else {
					newLeafletIdTextFirst = leafletIdText.split('_')[0];
				}
				var newLeafletIdText = newLeafletIdTextFirst + '_' + geoLayer._leaflet_id + '_' + leafletIdText.split('_')[2];
				$(this).html($(this).children('input').val(newLeafletIdText));
				$(this).append(newLeafletIdText);
			}
		});
	});
		
	/**
	 * sort numbers
	 */
	const sortNumber = (function(targetList) {
		targetList.sort(function(a, b) {
			if (Number(a) < Number(b)) {
				return -1;
			} else {
				return 1;
			}
		});
	})
	
	/**
	 * display sort pane of Spot List
	 */
	const dsiplaySortSpotList = (function() {
		commonClear(null, CLEAR_ROUTE_TRUE);
		
		$('#spot-list-table').find('#header-table').children('th').first().css("display", "table-cell"); /* or .show() */
		$('#spot-list-table').find('tr').each(function() {
			$(this).find('td').first().fadeIn(200);
		});
		$('#spot-list-table').find('tbody').sortable({
			disabled: false,
			update: function() {
				$('td[id^="spot-list-record-no-"]').each(function(idx) {
					var lastRecordNoInputHtml = $(this).children('input');
					
					// Update td record number.
					$(this).val(idx + 1);
					$(this)[0].textContent = idx + 1;  // rewrite td.textContent
					// Update td.input record number.					
					$(this).append(lastRecordNoInputHtml);
					$(this).children('input').val(idx + 1);

					idx++;
				});
			}
		});
		// extract Ids from tr elements 
		var trIds = $('#spot-list-table').children('tbody').sortable("toArray");		
	});
	
	/**
	 * hide sort pane of Spot List
	 */
	const hideSortSpotList = (function() {
		$('#spot-list-table').find('#header-table').children('th').first().css("display", "none");
		$('#spot-list-table').find('tr').each(function() {
			$(this).find('td').first().hide();
		});
		$('#spot-list-table').find('tbody').sortable({
			disabled: true
		});
	});
	
	// back to Spot　List:
	// send the checked recode back to the spot list when the button's clicked
	const sendBackToSpotList = (function() {
		$('.js-back-to-recode').click(function() {
			// hide the sort pane and clear the route on map
			commonClear(HIDE_SORT_TRUE, CLEAR_ROUTE_TRUE);
			
			var backToRecodeList = $('[id^="delete-list-record-content-emit-"]');
			var backToSpotList = new Array();
			backToRecodeList.each(function() {
				if($(this).prop('checked')) {
					backToSpotList.push($(this).closest('tr'));
				}
			});
			$.each(backToSpotList, function(idx, backToTarget) {
				var backedToTarget = delHtml(backToTarget);	
				delHtml(backToTarget.closest('tbody'));		
				var addressText = backedToTarget.children('td[id^="delete-list-record-content-address-"]')[0].textContent.replace(/\s+/g, '');			
				
				// placeIdの取得
				var backedTds = Array.from(backedToTarget[0].children);  // HTMLCOllectionを配列に変換
				var backedTd = backedTds.filter(tdElm => tdElm.id.startsWith('delete-list-record-no-'));
				var placeId = backedTd[0].id.substring(
						        backedTd[0].id.lastIndexOf('-', backedTd[0].id.length) + 1
						        , backedTd[0].id.length
						      );  // id部分=placeIdの取得
				
				var spotListRecordNo = Number($('td[id^="spot-list-record-no"]').last().text().replace(/\s+/g, ''));
				if (!spotListRecordNo) {
					spotListRecordNo = 0;
				}
				
				var latLonText = backedTds.filter(tdElm => tdElm.id.startsWith('delete-list-record-content-latLon-'))[0].textContent.replace(/\s+/g, '');
				var pointLeafletId = backedTds.filter(tdElm => tdElm.id.startsWith('delete-list-record-content-leafletid'))[0].textContent.split('_')[1].replace(/\s+/g, '');
				
				var tr = createSpotListRecord(spotListRecordNo, addressText, placeId, latLonText, pointLeafletId);
				addHtml($('#spot-list-table'), tr);
			});
			
			// reassign numbers to the recodes
			var deleteRecodeNums = $('td[id^="delete-list-record-no-"]');
			deleteRecodeNums.sort(function(a, b) {
				if (Number(a.textContent) < Number(b.textContent)) {
					return -1;
				} else {
					return 1;
				}
			});	
			$.each(deleteRecodeNums, function(idx, num) {
				num.textContent = idx + 1;
			});
			
			// add its marker back to the map
			var newLayersFeatureList = new Array();  // a list for new layers' features
			var pointGeoLayers = $.extend({}, pointGeoLayerGroup._layers);

			backToSpotList.forEach(function(backedToTarget) {
				var spotLat = backedToTarget.children('[id^="delete-list-record-content-latLon-"]')[0].textContent.split('_')[0].replace(/\s+/g, '');
				var spotLon = backedToTarget.children('[id^="delete-list-record-content-latLon-"]')[0].textContent.split('_')[1].replace(/\s+/g, '');
				var addressText = backedToTarget.children('td[id^="delete-list-record-content-address-"]')[0].textContent;
				var pLeafletId = backedToTarget.children('td[id="delete-list-record-content-leafletid"]').text().split('_')[0].replace(/\s+/g, '');
				var placeId = backedToTarget.children('td[id^="delete-list-record-content-leafletid"]').text().split(':')[1].replace(/\s+/g, '');
				
				var geoLayer = controlGeoInfo(null, spotLat, spotLon, addressText, Number(pLeafletId), false);
				
				pointedGeoLayerMap.set(Number(placeId), geoLayer._layers[geoLayer._leaflet_id - 1]);
			});
		});
	});
	
	// add HTML element to the htmlElm
	const addHtml = (function(htmlElm, target) {
		htmlElm.append(target);
		return target;
	});
	
	// remove HTML element
	const delHtml = (function(target) {
		var deletedElm = target.remove();
		return deletedElm
	});

	const addToSpotList2 = (function() {
		// add to list
		// hide the sort pane and clear the route on map
		commonClear(HIDE_SORT_TRUE, CLEAR_ROUTE_TRUE);
		
		// get data from search results
		var address = $(this).parent().prevAll('.js-search-result-address').text();
		var placeId = $(this).attr('name');
		var spotNoPlaceId = spotCntNo + ':' + placeId;
		var latLonText = $(this).parent().prevAll('.js-search-result-lanlon').text();
		var sLeafletId = $(this).parent().prevAll('.js-search-result-leafletid').text().split("_")[0];			
		var spotListRecordNo = Number($('td[id^="spot-list-record-no"]').last().text().replace(/\s+/g, ''));
		if (!spotListRecordNo) {
			spotListRecordNo = 0;
		}

		/** create spot list record */
		var pointLeafletId = null;	

		// spotCntNoを更新
		spotCntNo++;					
	});
	
	// add all the search results to the spot list
	/*
	 * if it's called by 'searchPlace' method
	 */
	const addToSpotList3 = (function() {
		// add to list
		$(document).off('click.name1', '[class^="js-search-result-button-"]');
		$(document).on('click.name1', '[class^="js-search-result-button-"]', function(){
			// hide the sort pane and clear the route on map
			commonClear(HIDE_SORT_TRUE, CLEAR_ROUTE_TRUE);
			
			// get data from search results
			var address = $(this).parent().prevAll('.js-search-result-address').text();
			var placeId = $(this).attr('name');
			var spotNoPlaceId = spotCntNo + ':' + placeId;
			var latLonText = $(this).parent().prevAll('.js-search-result-lanlon').text();
			var sLeafletId = $(this).parent().prevAll('.js-search-result-leafletid').text().split("_")[0];			
			var spotListRecordNo = Number($('td[id^="spot-list-record-no"]').last().text().replace(/\s+/g, ''));
			if (!spotListRecordNo) {
				spotListRecordNo = 0;
			}

			/** create spot list record */
			var pointLeafletId = null;					
			var tr = createSpotListRecord(spotListRecordNo, address, spotNoPlaceId, latLonText, pointLeafletId);
			addHtml($('#spot-list-table'), tr);  //$('#spot-list-table').append(tbody);  // $('table[id="spot-list-table"]').append(tbody);

			// spotCntNoを更新
			spotCntNo++;
			
			/** create layers */
			// copy pointGeoLayerGroup._layers to a new object
			var pointGeoLayers = null;
			if (pointGeoLayerGroup != undefined) {
				// if there's already pins on the map
				pointGeoLayers = $.extend({}, pointGeoLayerGroup._layers);
			} else {
				$.each(pointedGeoLayerMap, function(idx, pointedGeoLayer) {
					if (targetId == pointedGeoLayer.key) {
						pointGeoLayers = $.extend({}, pointedGeoLayer);
					}
				});
			}
			
			pointGeoLayers = $.extend({}, pointGeoLayerGroup._layers);
			if (pointGeoLayers != null && pointGeoLayers.length != 0) {
				
				// clear the pointGeoLayerGroup
				pointGeoLayerGroup.clearLayers();
				if ($('#spot-list-table').find('tr').length <= 2) {
					// clear the pointGeoLayerMap if there's no records at spot list
					pointedGeoLayerMap.clear();
				}
				var spotListLeafletId = $('[id^="spotList"][id$=".leafletId"]').val();
				var pLeafletId = spotListLeafletId.substr(spotListLeafletId.indexOf("_") + 1,
						spotListLeafletId.lastIndexOf("_") - (spotListLeafletId.indexOf("_") + 1));
				
				// Update pointGeoLayerGroup
				for (let key of searchedGeoLayerMap.keys()) {
					if (key == Number(placeId)) {
						pointedGeoLayerMap.set(Number(placeId), searchedGeoLayerMap.get(Number(placeId)));						
					} else {
						if (!pointedGeoLayerMap.has(key)) {
							pointedGeoLayerMap.delete(key);							
						}
					}
				}
			}
			
			var lat = latLonText.split("_")[0];
			var lon = latLonText.split("_")[1];
			for (let pkey of pointedGeoLayerMap.keys()) {
				var searchedLat = pointedGeoLayerMap.get(pkey)._latlng.lat;
				var searchedLon = pointedGeoLayerMap.get(pkey)._latlng.lng;
				var searchedLeafletId = pointedGeoLayerMap.get(pkey)._leaflet_id + 1;
				
				var pLeafletId = pointedGeoLayerMap.get(pkey)._leaflet_id + 1;
				for (let skey of searchedGeoLayerMap.keys()) {
					if (pkey == skey) {
						pLeafletId = searchedGeoLayerMap.get(skey)._leaflet_id + 1;
					}
				}
				controlGeoInfo(pointedGeoLayerMap.get(pkey).feature, searchedLat, searchedLon, null, pLeafletId, false);
			}
		});
	});

	// add to list
	// add the selected search result to the spot list when the button's pushed
	const addToSpotList = (function() {
		// add to list
		$(document).off('click.name1', '[class^="js-search-result-button-"]');
		$(document).on('click.name1', '[class^="js-search-result-button-"]', function(){
			// hide the sort pane and clear the route on map
			commonClear(HIDE_SORT_TRUE, CLEAR_ROUTE_TRUE);
			
			// get data from search results
			var address = $(this).parent().prevAll('.js-search-result-address').text();
			var placeId = spotCntNo + ':' + $(this).attr('name');
			var latLonText = $(this).parent().prevAll('.js-search-result-lanlon').text();
			var sLeafletId = $(this).parent().prevAll('.js-search-result-leafletid').text().split("_")[0];			
			var spotListRecordNo = Number($('td[id^="spot-list-record-no"]').last().text().replace(/\s+/g, ''));
			if (!spotListRecordNo) {
				spotListRecordNo = 0;
			}
			
			/** create spot list record */
			var pointLeafletId = pointGeoLayerGroup != null || pointGeoLayerGroup != undefined 
				? Object.keys(pointGeoLayerGroup._layers)[spotListRecordNo] : null;
			var tr = createSpotListRecord(spotListRecordNo, address, placeId, latLonText, pointLeafletId);
			addHtml($('#spot-list-table'), tr);  //$('#spot-list-table').append(tbody);  // $('table[id="spot-list-table"]').append(tbody);

			// spotCntNoを更新
			spotCntNo++;
			
			/** create layers */
			// copy pointGeoLayerGroup._layers to a new object
			var pointGeoLayers = null;
			if (pointGeoLayerGroup != undefined) {
				// if there's already pins on the map
				pointGeoLayers = $.extend({}, pointGeoLayerGroup._layers);
			} else {
				// if there's no pins on the map
				$.each(pointedGeoLayerMap, function(idx, searchedGeoLayer) {
					if (targetId == searchedGeoLayer.key) {
						pointGeoLayers = $.extend({}, searchedGeoLayer);
					}
				});
			}

			if (pointGeoLayers != null && pointGeoLayers.length != 0) {
				// clear the pointGeoLayerGroup if there's no records at spot list
				if ($('#spot-list-table').find('tr').length <= 2) {
					pointGeoLayerGroup.clearLayers();					
				}
				var spotListLeafletId = $('[id^="spotList"][id$=".leafletId"]').val();
				var pLeafletId = spotListLeafletId.substr(spotListLeafletId.indexOf("_"),
						spotListLeafletId.lastIndexOf("_") - (spotListLeafletId.indexOf("_") + 1));
				pLeafletId = spotListLeafletId.substr(0, spotListLeafletId.indexOf("_"));
				
				for (var pglLeafletId in pointGeoLayers) {
					if (pLeafletId == pglLeafletId) {
						pointGeoLayerGroup = pointGeoLayerGroup._layers[pglLeafletId];
					}
				}				
			}

			var lat = latLonText.split("_")[0];
			var lon = latLonText.split("_")[1];
			for (let key of pointedGeoLayerMap.keys()) {
				var searchedLat = pointedGeoLayerMap.get(key)._latlng.lat;
				var searchedLon = pointedGeoLayerMap.get(key)._latlng.lng;
				var searchedLeafletId = pointedGeoLayerMap.get(key)._leaflet_id + 1;		
				var pLeafletId = pointedGeoLayerMap.get(key)._leaflet_id;

				if (searchedLat.toString() == lat && searchedLon.toString() == lon && searchedLeafletId.toString() == sLeafletId) {
					controlGeoInfo(pointedGeoLayerMap.get(key).feature, searchedLat, searchedLon, null, pLeafletId, false);
				}
			}			
		});
	});

    // search for the place (ajax)
	const searchPlace = (function() {
		// search button
		$('#search-button').on('click', function() {
			var jsonResultDataList = new Array();
			var resultPlaceIdList = new Array();
			
			// delete the old searched results
			delHtml($('#search-result-table').children('tbody'));
			
			var requestContent = $('input[id="content-to-search"]').val();
			
			const MAP_URL = "https://nominatim.openstreetmap.org/search";
			const HEROKU_PROXY = "https://immense-atoll-08173.herokuapp.com/";
			var params = "?format=json" + "&q=" + requestContent;
			var url = MAP_URL + params;

			const ALLOWED_METHODS = [
			    'GET',
			    'POST',
			    'PUT',
			    'PATCH',
			    'DELETE',
			    //'HEAD',
			    'OPTIONS'
			];
			const ALLOWED_ORIGINS = [
				MAP_URL
			];
			const ALLOWED_HEADERS = [
				//"Accept, Content-Type, Content-Length, Accept-Encoding, X-Requested-With, Origin, X-Csrftoken, X-CSRF-Token, Authorization"
				'Content-type',
				'Accept',
				'X-Custom-Header'
			];
			
			var headers = {"Access-Control-Allow-Origin": ALLOWED_ORIGINS,
					       //"Content-Type" : "application/json;charset=UTF-8", 
					       "Access-Control-Allow-Methods" : ALLOWED_METHODS.join(','),
					       "Access-Control-Allow-Headers" : ALLOWED_HEADERS.join(',')
					       };

			$.ajax({	
				headers:headers, // 現場のソース													
				url:url,
				type:"GET",  // 現場のソースはpost
				//data:requestContent, // 送信するデータ
				dataType: 'json', // 応答のデータの種類 (xml/html/script/json/jsonp/text)
				//jsonpCallback: 'callback',
				timespan:1000,  // 通信のタイムアウトの設定(ミリ秒)
				// async: false, 同期にする場合はasync:falseを追加する
				processData:false, // 現場のソース
				contentType:false, // 現場のソース
				context:this, // 現場のソース
				
				//  引数：response　通信で取得したデータ
				//  引数：textStatus　通信結果のステータス
				//  引数：jqXHR　XMLHttpRequestオブジェクト
				}).done(function(response,textStatus,jqXHR) {
					if ($('#spot-list-table').find('tr').length < 2) {
						// clear the pointGeoLayerMap if there's no records at spot list
						pointGeoLayerGroup.clearLayers();
						pointedGeoLayerMap.clear();
					}
					
					console.log("Api Response: " + jqXHR.status 
							+ "(" + textStatus + ")"); // 例：200, success

					// レスポンスをJSON形式の文字列に変換
					var strResponse = JSON.stringify(response);
					console.log(strResponse);
					var jsonStrResponseList = strResponse.slice(1, -1).split('},');
					
					$.each(jsonStrResponseList, function(idx, jsonStrResponse) {
						if(idx != (jsonStrResponseList.length - 1)) {
							jsonStrResponse = jsonStrResponse + '}';							
						}
						// JSON形式の文字列をJSONオブジェクトに変換
						var result = JSON.parse(jsonStrResponse || "null");
						jsonResultDataList.push(result);
					});	
					$.each(jsonResultDataList, function(idx, jsonResult) {
						if (jsonResult != null) {
							console.log(jsonResult["place_id"]);
							resultPlaceIdList.push(jsonResult["place_id"]);							
						}
					});
					
					if (resultPlaceIdList.length != 0) {
						showOnMap(jsonResultDataList);
						displayResult(jsonResultDataList, resultPlaceIdList);
					}
					
					// add an event of add-to-spot-list event
					addToSpotList2();

				}).fail(function(jqXHR, textStatus, errorThrown ) {
				    console.log(jqXHR.status); //例：404
				    console.log(textStatus); //例：error
				    console.log(errorThrown); //例：NOT FOUND

			    // alwaysは成功/失敗に関わらず実行される
				}).always(function(){
			        console.log("api done");
			});
		});
	});
	
	// display the result of the search
	const displayResult = (function(jsonResultDataList, resultPlaceIdList) {		
		var searchResultTbodies = null;
		var displayRecordNum = 0;
		$.each(jsonResultDataList, function(idx, jsonResultData) {
			displayRecordNum++;
			searchResultTbodies = searchResultTbodies + createSearchResultRecord(jsonResultData, displayRecordNum)
		});
		$('#search-result-table').append(searchResultTbodies);
	});	

	/**
	 * sort Spot List: handle the sort pane of Spot List
	 */
	const handleSortPane = (function() {
		$('[class^="js-to-sort-spot-list"]').click(function() {
			if ($('div[class^="js-draw-route"]').children('input[name="check"]').prop('checked')) {
				// clear the route on map
				$('.js-draw-route').trigger('click');				
			}

			
			if ($('#spot-list-table').find('#header-table').children('th').first().is(':hidden')) {
				dsiplaySortSpotList();
			} else {
				hideSortSpotList();
			}
       	});
	});

	/**
	 * Initialize the map
	 */
	const initMap = (function() {
		var spotList = [];
		var spotTrList = $('#spot-list-table').children('tbody').children('tr');
		if (spotTrList.length != 0) {
			// if there's spot info saved previously
			var savedAddress = $('#spot-list-table').children('tbody').children('tr:nth-child(1)').children('[id^="spot-list-record-content-address"]').children('input').val();
			if (savedAddress.length != 0) {
				for (var tr of spotTrList) {
					var initLatLon = $('#spot-list-table').find('[id^="spotList' + (tr.id - 1) + '.latLon"]').val().replace(/\s+/g, '');
					var initLatitude = initLatLon.split("_")[0];
					var initLongitude = initLatLon.split("_")[1];
					var initAddress = $('#spot-list-table').find('[id^="spotList' + (tr.id - 1) + '.address"]').val();
					var initLeafletId = $('#spot-list-table').find('[id^="spotList' + (tr.id - 1) + '.leafletId"]').val();
					spotList.push({
						latitude: initLatitude, 
						longitude: initLongitude, 
						address: initAddress, 
						leafletId: initLeafletId 
					});
				}				
			}
		} else {
			// If this is the 1st time or there's no past data in DB.
			spotList.push({
				latitude: LATITUDE, 
				longitude: LONGITUDE, 
				address: DEFAULT_ADDRESS,
				leafletId: undefined
			});
		}
		
		//var map = L.map('mapContainer').setView([51.505, -0.09], VIEW_ZOOM_LEVEL);
		map.setView([spotList[0].latitude, spotList[0].longitude], VIEW_ZOOM_LEVEL);
		
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
	        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	    }).addTo(map);
		
		/* add a marker <- ordinary way if you don't use geoJson */
		// L.marker([35.69, 139.69]).addTo(map); // Tokyo'S lat, lon
		for (var s of spotList) {			
			if (s.leafletId == undefined) {
				// add a marker and this spot to pointedGeoLayerMap
				var geoLayer = controlGeoInfo(null, s.latitude, s.longitude, s.address, null, true);
			} else {
				var placeId = s.leafletId.split(':')[1];
				var pLeafletId = s.leafletId.split('_')[0];
				// add a marker and this spot to pointedGeoLayerMap
			    var geoLayer = controlGeoInfo(null, s.latitude, s.longitude, s.address, pLeafletId, true);
				pointedGeoLayerMap.set(Number(placeId), geoLayer._layers[geoLayer._leaflet_id - 1]);				
			}
		}
	});
		
	// show geo data on map
	const showOnMap = (function(jsonResultDataList) {		
		$.each(jsonResultDataList, function(idx, data) {
			map.setView([data.lat, data.lon], VIEW_ZOOM_LEVEL);
			var geoLayer = controlGeoInfo(null, data.lat, data.lon, data.display_name, null, false);
			searchedGeoLayerMap.set(data.place_id, geoLayer._layers[geoLayer._leaflet_id - 1]);
		})
	});
	
	/**
	 * add a marker of the geoJson format
	 */
	const controlGeoInfo = (function(feature, latitude, longitude, address, pLeafletId, fistDisplayFlg) {
		var geojsonFeature;
		
		if (feature == null) {
			geojsonFeature = [{
				"type": "Feature",
				"geometry": {
				    "type": "Point",
				    "coordinates": [longitude, latitude]
				},
				"properties": {
				 "popupContent": address
				}
			}];			
		} else {
			geojsonFeature = feature;
		}

		var geoLayer = L.geoJson(geojsonFeature, {
			onEachFeature: function(feature, layer) {
				if (feature && feature.properties && feature.properties.popupContent) {
				  	layer.bindPopup(feature.properties.popupContent);			
				}
		    }
		});
		
		pointGeoLayerGroup.addTo(map);  // make a point geoLayer group
		pointGeoLayerGroup.addLayer(geoLayer);  // add layers to pointGeoLayerGroup._layers 
		
		// 引数のpLeafletIdは以前のleafletIdなので、これとhtmlを突き合わせて合うものに対して適切な最新のleaflet_idを再付与する
		syncPLeafletIdOnHtml(pLeafletId, geoLayer, fistDisplayFlg);
		
		return geoLayer;
	});

	/**
	 * draw route: draw a route on map
	 */
	const drawRoute = (function() {
		$('.js-draw-route').click(function() {
			// hide sort pane
			commonClear(HIDE_SORT_TRUE, null);			
			
			$('.js-draw-route').toggleClass('checked');
			if(!$(this).children('input[name="check"]').prop("checked")) {
				$(".js-draw-route input").prop("checked", true);
				
				var latLonList = new Array();
				var coordinates = new Array();
				
				$('[id^="spot-list-record-content-latLon-"]').each(function(idx, latLonTd) {
					latLonList.push(
							{
								latitude: latLonTd.textContent.split("_")[0], 
								longitude: latLonTd.textContent.split("_")[1]
							}
					)
				});
				
				latLonList.forEach(latLon => coordinates.push([Number(latLon.longitude), Number(latLon.latitude)]));
				addLineGeoLayerGroup(coordinates);
			} else {
				$(".js-draw-route input").prop("checked", false);
				
				lineGeoLayerGroup.clearLayers();
			}
		})
	});
	
	const addLineGeoLayerGroup = (function(coordinates) {
		var lines = {
				"type": "FeatureCollection",
				"features": [
					{
						"type": "Feature",
						"properties:": {
							"popupContent": "<p>route</p>"
						},
						"geometry": {
							"type": "LineString",
							"coordinates": coordinates
						}
					}
				]
		}
		
		var lineLayer = L.geoJSON(lines, {
			onEachFeature: function onEachFeature(feature, layer) {
				if(feature.properties && feature.properties.popupContent) {
			          layer.bindPopup(feature.properties.popupContent);
			    }
			}
		})
 		lineGeoLayerGroup.addTo(map);  // make a line geoLayer group
		lineGeoLayerGroup.addLayer(lineLayer);
	});
	
	const commonClear = (function(hideSortFlg, clearRouteFlg) {
		if (hideSortFlg) {
			hideSortSpotList();			
		}
		if (clearRouteFlg) {
			if ($('div[class^="js-draw-route"]').children('input[name="check"]').prop('checked')) {
				// clear the route on map
				$('.js-draw-route').trigger('click');				
			}					
		}
	});
	
	/**
	 * confirm the created route
	 */
	const confirm = (function() {
		$('.js-confirm').click(function() {
			// manipulate the toggle
			$(this).toggleClass('active');
			
			$('.body-make-new-plans').slideToggle();
			$('.map-search-results').slideToggle();
			
			// when the class should be 'active', copy spot list to the created route
			if ($(this).attr('class').endsWith('active')) {
				// clear the created route table
				delHtml($('.body-created-route tbody'));
				
				// copy spot list to the created route
				$.each($('#spot-list-table tbody').children('tr'), function() {
					// add a new tr
					var newTr = '<tr id="' + $(this).attr('id') + '"></tr>';
					var editTable = $('.body-created-route table').append(newTr);
					
					// create the copy source and edit its ids
					var copySource = $(this).children().clone();
					copySource.each(function() {
						if ($(this).attr('id') != null) {
							var replacedId = $(this).attr('id').replace('spot-list-record', 'created-route');
							$(this).attr('id', replacedId);							
						}
					})
					
					// copy spot list and add to the new tr
					editTable.find('#' + $(this).attr('id')).append(copySource);		
				});
				
				delHtml($('#spot-list-area tbody'));
			} else {
				// when the class is NOT 'active', copy created route to spot list
				// clear the spot list table
				delHtml($('#spot-list-area tbody'));
				
				// copy spot list to the created route
				$.each($('#created-route-table tbody').children('tr'), function() {
					// add a new tr
					var newTr = '<tr id="' + $(this).attr('id') + '"></tr>';
					var editTable = $('#spot-list-area table').append(newTr);
					
					// create the copy source and edit its ids
					var copySource = $(this).children().clone();
					// var copySource = $(this).children('[id^="created-route-"]').slice(0, 6).clone();
					copySource.each(function() {
						if ($(this).attr('id') != null) {
							var replacedId = $(this).attr('id').replace('created-route', 'spot-list-record');
							$(this).attr('id', replacedId);							
						}
					})
					
					// copy spot list and add to the new tr
					editTable.find('#' + $(this).attr('id')).append(copySource);			
				});
				
				delHtml($('.body-created-route tbody'));
			}
			
			// show/hide body-created-route area
			$('.body-created-route').toggle();
			return
		});
	});
	
	const rewriteFormIndexes = (function(trElm, spotListIndex) {
		var targetInputElms = trElm.children('td').children('[id^="spotList"]');
		targetInputElms.each(function() {
			var id = $(this).attr('id');
			var idFirstPt = id.substring(0, id.indexOf('.') - 1);
			var idSecondPt = id.substring(id.indexOf('.') + 1, id.length);
			
			var newId = idFirstPt + spotListIndex + '.' + idSecondPt;
			var newName = idFirstPt + '[' + spotListIndex + '].' + idSecondPt;
			
			$(this).attr('id', newId);
			$(this).attr('name', newName);
		});
	});
	
	const confirmEmptyEnter = (function() {
		$('#js-modal-confirm-empty-enter-btns').children('button').click(function(elm) {
			if (modalConfirmEmptyEnter($(this).val())) {
				$('#save').trigger('click');;
			} else {
				$('#js-modal-confirm-empty-enter').css('display', 'none');		
				return false;
			}			
		});
	});
	
	// method right before submit
	const beforeSubmit = (function() {
		$('#save').click(function() {
			// if the form is empty, show the modal to warn.
			if (!$('#spot-list-table').children('tbody').children().length &&
					!$('#created-route-table').children('tbody').children().length) {
				if ($('#js-modal-confirm-empty-enter').css('display') == 'none') {
					$('#js-modal-confirm-empty-enter').css('display', 'block');						
				}
				// not continue the submit process if except for yes
				if ($('#confirm-empty-enter-val').val() != "0") {
					return false;						
				}
			}
			
			confirm();			
			var recordNoElmList = null;
			if ($('.js-confirm').attr('class').endsWith('active')) {
				recordNoElmList = $('[id^="created-route-no"]');
			} else {
				recordNoElmList = $('[id^="spot-list-record-no"]');
			}
			recordNoElmList = recordNoElmList.sort(function(a, b) {
				if (Number(a.textContent) < Number(b.textContent)) {
					return -1;
				} else {
					return 1;
				}
			});	
			recordNoElmList.each(function() {
				// spotListIndex = index にするか？
				var spotListIndex = Number($(this).text()) - 1;
				rewriteFormIndexes($(this).parents('tr'), spotListIndex);
			});
			
			$('form').submit();
		});
	});
	
	const setEvent = (function() {
		addToSpotList3();
		addSpotListRecode();
		sendToDeleteList();
		sendBackToSpotList();
		searchPlace();
		handleSortPane();
		drawRoute();
		confirmEmptyEnter();
		confirm();
		beforeSubmit();
	});
	
	$(function(){
		initMap();
		setEvent();		
		$('#search-button').trigger('click');
		location.href="#";
	});
});

$(function(){
    createRoute();
});