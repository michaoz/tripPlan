import {modalConfirmEmptyEnter} from '../modalConfirmEmptyEnter.js'

//const createRoute = (function() {
const createRoute = (function () {
	/** global variable *******************/

	// The default address when the page is read.
	const DEFAULT_ADDRESS = '6 Southwark St, London SE1 1TQ Ingland';
	const LATITUDE = 51.505;
	const LONGITUDE = -0.09;
	const VIEW_ZOOM_LEVEL = 15;
	
	// Bag No List
	const BAG_NO_ARRY = ["01", "02", "03"];
	
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

	// 	create luggage records
	const createLuggageRecord = (function(recordNum, itemName, bagNo) {
		recordNum++;
		
		let itemCount = '';
		var thisLuggageInfoListIndex = 0;
		var thisLuggageItemListIndex = 0;
		var otherMaxLuggageInfoIndex = -1;
		
		$('[id$=".bagNo"]').each(function() {
			if ($(this).val() == bagNo) {
				// get the curreent target's luggage info index
				var target = $(this).parent().next('[class^="luggage-item-no"]').children('[id^="luggageInfoList"]');
				let luggageInfoIndex = Number(target.attr('id').slice(target.attr('id').indexOf('.') - 1, target.attr('id').indexOf('.')));				
				let luggageItemIndex = Number(target.attr('id').slice(target.attr('id').lastIndexOf('.') - 1, target.attr('id').lastIndexOf('.')));				
				// update the current luggage info index and luggage item index
				thisLuggageInfoListIndex = luggageInfoIndex > thisLuggageInfoListIndex ? luggageInfoIndex : thisLuggageInfoListIndex;
				thisLuggageItemListIndex = luggageItemIndex > thisLuggageItemListIndex ? luggageItemIndex + 1 : thisLuggageItemListIndex + 1;
				
			} else {
				// get other's luggage info index
				let otherLuggageInfoIndex = Number($(this).attr('id').slice($(this).attr('id').indexOf('.') - 1, $(this).attr('id').indexOf('.')));
				// update the otherMaxLuggageInfoIndex
				otherMaxLuggageInfoIndex = otherLuggageInfoIndex > otherMaxLuggageInfoIndex ? otherLuggageInfoIndex : otherMaxLuggageInfoIndex;
				// update the current maxLuggageInfoIndex
				thisLuggageInfoListIndex = otherMaxLuggageInfoIndex + 1;
			}
		})
		
		var itemNo = Number(thisLuggageItemListIndex) + 1;
		
		var tdNo = '<td class="luggage-record-no" >'
		           + '<input type="hidden" value="' + recordNum + '">'
                   + recordNum
                   + '</td>';
		var tdBagNo = '<td class="luggage-bag-no" >'
		              + '<select id="luggageInfoList' + thisLuggageInfoListIndex + '.luggageItemList' + thisLuggageItemListIndex + '.bagNo" name="luggageInfoList[' + thisLuggageInfoListIndex + '].luggageItemList[' + thisLuggageItemListIndex + '].bagNo" >';

		for (let i = 0; i < BAG_NO_ARRY.length; i++) {
        	if (i == 0) {
            	tdBagNo = tdBagNo + '<option value="' + BAG_NO_ARRY[i] + '" selected="selected">' + BAG_NO_ARRY[i] + '</option>'
        	} else {
            	tdBagNo = tdBagNo + '<option value="' + BAG_NO_ARRY[i] + '">' + BAG_NO_ARRY[i] + '</option>'        		
        	}
        }             
        tdBagNo = tdBagNo + '</select></td>';
		var tdItemNo = '<td class="luggage-item-no" >'
                   + '<input id="luggageInfoList' + thisLuggageInfoListIndex + '.luggageItemList' + thisLuggageItemListIndex + '.itemNo" name="luggageInfoList[' + thisLuggageInfoListIndex + '].luggageItemList[' + thisLuggageItemListIndex + '].itemNo"'
                   + ' type="hidden" value="' + itemNo + '">'
		           + '</td>';
		var tdSortLeader = '<td><span></span>' + '</td>';
		var tdItemName = '<td class="luggage-item-name">' 
             		     + '<input id="luggageInfoList' + thisLuggageInfoListIndex + '.luggageItemList' + thisLuggageItemListIndex + '.itemName" name="luggageInfoList[' + thisLuggageInfoListIndex + '].luggageItemList[' + thisLuggageItemListIndex + '].itemName"'
                         + ' type="text" value="' + itemName + '">'
                         + '</td>';
		var tdItemCount = '<td class="luggage-item-count">'
		                  + '<input id="luggageInfoList' + thisLuggageInfoListIndex + '.luggageItemList' + thisLuggageItemListIndex + '.itemCount" name="luggageInfoList[' + thisLuggageInfoListIndex + '].luggageItemList[' + thisLuggageItemListIndex + '].itemCount"'
                          + ' type="text" value="' + itemCount + '">'
		                  + '</td>';
        var tdEmitChbox = '<td class="luggage-item-emit">' 
        	              + '<input type="checkbox" id="luggage-item-count-emit-' + recordNum + '" '
                          + 'class="css-list-chbox" >'
                          + '<label for="luggage-item-count-emit-' + recordNum + '" class="css-list-chbox-label">✓</label>'
                          + '</td>';

		var tr = '<tr>'  
			+ tdSortLeader
			+ tdNo 
			+ tdBagNo
			+ tdItemNo 
			+ tdItemName 
			+ tdItemCount
			+ tdEmitChbox
			+ '</tr>';

		return tr;
	});
	
	const getMaxLuggageInfoItemListIndex = (function(targetElm) {
		var maxLuggageInfoListIndex = 0;
		var maxLuggageInfoListIndex = 0;
		var targetElms = $('[class^="luggage-item-no"]').children('[id^="luggageInfoList"]');
		for (let i = 0; i < targetElms.size(); i++) {
			if (i > 0) {
				var preInfoIndex = Number(
						targetElms[i - 1].id.substring(targetElms[i - 1].id.indexOf('.') - 1, targetElms[i - 1].id.indexOf('.')));
				var curInfoIndex = Number(
						targetElms[i].id.substring(targetElms[i].id.indexOf('.') - 1, targetElms[i].id.indexOf('.')));				
				maxLuggageInfoListIndex = curInfoIndex > preInfoIndex ? curInfoIndex : preInfoIndex;

				var preItemIndex = Number(
						targetElms[i - 1].id.substring(targetElms[i - 1].id.lastIndexOf('.') - 1, targetElms[i - 1].id.lastIndexOf('.')));
				var curItemIndex = Number(
						targetElms[i].id.substring(targetElms[i].id.lastIndexOf('.') - 1, targetElms[i].id.lastIndexOf('.')));
				maxLuggageInfoListIndex = curItemIndex > preItemIndex ? curItemIndex : preItemIndex;
			}
		}
		return [maxLuggageInfoListIndex, maxLuggageItemListIndex];
	})
	
	const getOtherMaxLuggageInfoListIndex = (function(targetElm) {
		var otherMaxLuggageInfoIndex = -1;
		
		var target = targetElm.parent().children('[class^="luggage-item-no"]').children('[id^="luggageInfoList"]');
		target.attr('id').substring(target.attr('id').indexOf('.') - 1, target.attr('id').indexOf('.'));
		
		
		return otherMaxLuggageInfoIndex;
	})

	// create delete list records
	const createDeleteListRecord = (function(recordNum, target, placeId, pLeafletId) {
		recordNum++;

		var searchedLeafletId = searchedGeoLayerMap.get(Number(placeId.split(DELIMITER_COLON)[1]))._leaflet_id + 1;
		if (pLeafletId == undefined) {
			pLeafletId = searchedLeafletId;
		}
		
		var spotName = target.children('td[id^="luggage-record-content-spotName-"]')[0].textContent;
		var city = target.children('td[id^="luggage-record-content-city-"]')[0].textContent;
		var address = target.children('td[id^="luggage-record-content-address-"]')[0].textContent;
		var latLon = target.children('td[id^="luggage-record-content-latLon-"]')[0].textContent;

		var tdNo = '<td id="delete-list-record-no-' + placeId + '" >' + recordNum + '</td>';
		var tdItemName = '<td id="delete-list-record-content-spotName-' + placeId + '">' 
		                 + spotName + '</td>';
        var tdCity = '<td style="display: none" id="delete-list-record-content-city-' + placeId + '">'
                     + city + '</td>';
        var tdAddress = '<td style="display: none" id="delete-list-record-content-address-' + placeId + '">'
                        + address + '</td>';
        var tdLatLon = '<td style="display: none" id="delete-list-record-content-latLon-' + placeId + '">'
                        + latLon + '</td>';
		var tdLeafletId = '<td style="display: none" id="delete-list-record-content-leafletid">' + searchedLeafletId + '_' + pLeafletId + '_' + placeId + '</td>';
		var tdAddChbox = '<td>' + '<input type="checkbox" id="delete-list-record-content-emit-' + placeId + '" '
		            + 'class="css-list-chbox" value=' + placeId + '>'
	                + '<label for="delete-list-record-content-emit-' + placeId + '" class="css-list-chbox-label">✓</label>'
		            + '</td>';
		      
		var tbody = '<tbody id="" >' 
			+ tdAddChbox
			+ tdNo
			+ tdItemName
			+ tdCity
			+ tdAddress
			+ tdLatLon
			+ tdLeafletId
			+ '</tbody>';
		
		return tbody;
	});	
	
	// Sync PointGeoLayer leaflet_id on HTML when the layers on map were edited
	const syncPLeafletIdOnHtml = (function(pLeafletId, geoLayer) {
		$('[id = "luggage-record-content-leafletid"]').each(function() {
			var leafletIdText = $(this).text();
			if (leafletIdText.split('_')[1] == (pLeafletId + 1)) {
				$(this).text(leafletIdText.split('_')[0] + '_' + geoLayer._leaflet_id + '_' + leafletIdText.split('_')[2]);
			}
		});
	});
		
	// sort numbers
	const sortNumber = (function(targetList) {
		targetList.sort(function(a, b) {
			if (Number(a) < Number(b)) {
				return -1;
			} else {
				return 1;
			}
		});
	})
	
	// display sort pane of Spot List
	const dsiplaySortSpotList = (function() {
		commonClear(null, CLEAR_ROUTE_TRUE);
		
		$('#luggage-list-table').find('#header-table').children('th').first().css("display", "table-cell"); /* or .show() */
		$('#luggage-list-table').find('tr').each(function() {
			$(this).find('td').first().fadeIn(200);
		});
		$('#luggage-list-table').find('tbody').sortable({
			disabled: false,
			update: function() {
				$('td[class^="luggage-record-no"]').each(function(idx) {
					$(this).val(idx + 1);
					$(this)[0].textContent = idx + 1;  // rewrite td.textContent
					idx++;
				});
			}
		});
		// extract Ids from tr elements 
		var trIds = $('#luggage-list-table').children('tbody').sortable("toArray");		
	});
	// hide sort pane of Spot List
	const hideSortSpotList = (function() {
		$('#luggage-list-table').find('#header-table').children('th').first().css("display", "none");
		$('#luggage-list-table').find('tr').each(function() {
			$(this).find('td').first().hide();
		});
		$('#luggage-list-table').find('tbody').sortable({
			disabled: true
		});
	});
		
	// add HTML element to the htmlElm
	const addHtml = (function(htmlElm, target) {
		htmlElm.append(target);	
		
		changeSelectedBagNo();
		
		return target;
	});
	
	// remove HTML element
	const delHtml = (function(target) {
		var deletedElm = target.remove();
		return deletedElm
	});

	// add search results to the spot list
	const addToSpotList = (function() {
		// add to list
		$(document).off('click.name1', '[class^="js-search-result-button-"]');
		$(document).on('click.name1', '[class^="js-search-result-button-"]', function(){
			// hide the sort pane and clear the route on map
			commonClear(HIDE_SORT_TRUE, CLEAR_ROUTE_TRUE);
			
			// get data from search results
			var address = $(this).parent().prevAll('.js-search-result-address').text();
			var placeId = luggageCntNo + ':' + $(this).attr('name');
			var latLonText = $(this).parent().prevAll('.js-search-result-lanlon').text();
			var sLeafletId = $(this).parent().prevAll('.js-search-result-leafletid').text().split("_")[0];			
			var spotListRecordNo = $('td[class^="luggage-item-no"]').last().text();
			if (!spotListRecordNo) {
				spotListRecordNo = 0;
			}

			/** create spot list record */
			var pointLeafletId = Object.keys(pointGeoLayerGroup._layers)[spotListRecordNo];
			var tr = createLuggageRecord(spotListRecordNo, address, placeId, latLonText, pointLeafletId);
			addHtml($('#luggage-list-table'), tr);  //$('#luggage-list-table').append(tbody);  // $('table[id="luggage-list-table"]').append(tbody);
			
			// luggageCntNoを更新
			luggageCntNo++;
			
			/** create layers */
			// copy pointGeoLayerGroup._layers to a new object 
			var pointGeoLayers = $.extend({}, pointGeoLayerGroup._layers);
			if (pointGeoLayers != null && pointGeoLayers.length != 0) {
				// clear the pointGeoLayerGroup if there's no records at spot list
				if ($('#luggage-list-table').find('tr').length <= 2) {
					pointGeoLayerGroup.clearLayers();					
				}
			}

			var lat = latLonText.split("_")[0];
			var lon = latLonText.split("_")[1];
			for (let key of searchedGeoLayerMap.keys()) {
				var searchedLat = searchedGeoLayerMap.get(key)._latlng.lat;
				var searchedLon = searchedGeoLayerMap.get(key)._latlng.lng;
				var searchedLeafletId = searchedGeoLayerMap.get(key)._leaflet_id + 1;		
				var pLeafletId = searchedGeoLayerMap.get(key)._leaflet_id;

				if (searchedLat.toString() == lat && searchedLon.toString() == lon && searchedLeafletId.toString() == sLeafletId) {
					controlGeoInfo(searchedGeoLayerMap.get(key).feature, searchedLat, searchedLon, null, pLeafletId);
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
						var result = JSON.parse(jsonStrResponse);
						jsonResultDataList.push(result);
					});
					$.each(jsonResultDataList, function(idx, jsonResult) {
						console.log(jsonResult["place_id"]);
						resultPlaceIdList.push(jsonResult["place_id"]);
					});
					
					if (resultPlaceIdList.length != 0) {
						showOnMap(jsonResultDataList);
						displayResult(jsonResultDataList, resultPlaceIdList);
					}
					// add an event of add-to-spot-list event
					addToSpotList();

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

	// sort luggage List:
	// handle the sort pane of Spot List
	const handleSortPane = (function() {
		$('[class^="js-to-sort-luggage-list"]').click(function() {
			if ($('div[class^="js-luggage-keyword"]').children('input[name="check"]').prop('checked')) {
				// clear the route on map
				$('.js-luggage-keyword').trigger('click');				
			}

			
			if ($('#luggage-list-table').find('#header-table').children('th').first().is(':hidden')) {
				dsiplaySortSpotList();
			} else {
				hideSortSpotList();
			}
       	});
	});
		
	// show geo data on map
	const showOnMap = (function(jsonResultDataList) {
		// remove old layers/markers on map
		pointGeoLayerGroup.clearLayers();			
		searchedGeoLayerMap = new Map();
		
		$.each(jsonResultDataList, function(idx, data) {
			map.setView([data.lat, data.lon], VIEW_ZOOM_LEVEL);
			var geoLayer = controlGeoInfo(null, data.lat, data.lon, data.display_name, null);
			//searchedGeoLayerMap.set(geoLayer._leaflet_id - 1, geoLayer._layers[geoLayer._leaflet_id - 1]);
			searchedGeoLayerMap.set(data.place_id, geoLayer._layers[geoLayer._leaflet_id - 1]);
		})
	});
	
	// add a marker of the geoJson format
	const controlGeoInfo = (function(feature, latitude, longitude, address, pLeafletId) {
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
		pointGeoLayerGroup.addLayer(geoLayer);
		
		// 引数のpLeafletIdは以前のleafletIdなので、これとhtmlを突き合わせて合うものに対して適切な最新のleaflet_idを再付与する
		syncPLeafletIdOnHtml(pLeafletId, geoLayer);
		
		return geoLayer;
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
	})
	
	/* confirm the created route */
	const confirm = (function() {
		$('.js-confirm').click(function() {
			// manipulate the toggle
			$(this).toggleClass('active');
			
			$('.body-make-new-plans').slideToggle();
			$('.map-search-results').slideToggle();
			
			// when the class should be 'active', copy spot list to the created route
			if ($(this).attr('class').endsWith('active')) {
				// clear the table
				delHtml($('.body-create-route tbody'));
				
				// copy spot list to the created route
				$.each($('#luggage-list-table tbody').children('tr'), function() {
					// add a new tr
					var newTr = '<tr id="' + $(this).attr('id') + '"></tr>';
					var editTable = $('.body-create-route table').append(newTr);
					
					// create the copy source and edit its ids
					var copySource = $(this).children('[id^="luggage-record-"]').slice(0, 4).clone();
					copySource.each(function() {
						var replaced = $(this).attr('id').replace('spot-list-record', 'created-route');
						$(this).attr('id', replaced);
					})
					
					// copy spot list and add to the new tr
					editTable.find('#' + $(this).attr('id')).append(copySource);				
				});
			}
			// show/hide body-create-route area
			$('.body-create-route').toggle();
		});
	});
	
	// select luggage keyword: 
	// event when a luggage keyword is selected.
	const selectLuggageKeyword = (function() {
		$('[class^="js-luggage-keyword_"]').children('input[type=checkbox]').change(function() {
			// hide sort pane
			commonClear(HIDE_SORT_TRUE, null);			

			var otherLuggageKeywords = $('[class^="js-luggage-keyword_"]').children('input[type=checkbox]').not($(this));
			// 押下されたキーワード以外のキーワードのチェックを外す
			otherLuggageKeywords.prop('checked', false);
			otherLuggageKeywords.each((idx, otherLuggageKeyword) => {
				$('.js-luggage-keyword-items').children('[id^="item-' + otherLuggageKeyword.id.substr(-1) + '-"]').hide();
			});

			// 押下されたキーワードのチェック状態を更新			
			var luggageKeywordIdx = $(this).attr('id').substr(-1);
			if ($(this).prop('checked')) {
				var a = $(this);
				$('.js-luggage-keyword-items').children('[id^="item-' + luggageKeywordIdx + '-"]').slideDown();
			} else {
				var b = $(this);
				$('.js-luggage-keyword-items').children('[id^="item-' + luggageKeywordIdx + '-"]').slideUp();
			}
			
			$('.js-luggage-keyword').toggleClass('checked');
		});
	});
	
	// luggage keyword:
	// event when a luggage keyword is selected
	const selectLuggageItem = (function() {
		$('.js-luggage-keyword-items').children('[id^="item-"]').children('input[type=button]').click(function() {
			var selectedItemName = $(this).next('label').text();
			addLuggageRecord(selectedItemName);
			deleteChangeRecordColor();
		});
	});
	
	// add a record btn: 
	// event when the button's clicked to add a record
	const addRecordBtn = (function() {
		$('.js-add-record-btn').click(function() {
			addLuggageRecord("");
			deleteChangeRecordColor();
		});
	});
	
	const addLuggageRecord = (function(selectedItemName) {
		// hide the sort pane and clear the route on map
		commonClear(HIDE_SORT_TRUE, CLEAR_ROUTE_TRUE);
		
		var luggageListRecordNo = $('td[class^="luggage-record-no"]').last().text();
		if (!luggageListRecordNo) {
			luggageListRecordNo = 0;
		}
		
		var bagNo = '-';
		var tr = createLuggageRecord(luggageListRecordNo, selectedItemName, bagNo);
		$('#luggage-list-table').append(tr);  // $('table[id="luggage-list-table"]').append(tbody);
		luggageCntNo++;
	});
	
	const changeSelectedBagNo = (function() {
		// when selected bagNo is changed
		$(document).on('change', '[id$=".bagNo"]', function() {
			var thisBagNo = $(this).val();
			setLuggageInfoItem();
		});
	})
	
	// - param : trElm  TR element 
	const rewriteFormIndexes = (function(trElm, infoIndex, itemIndex) {
		var targetTdElms = trElm.children('[class^="luggage-"]').children('[id^="luggageInfoList"]');
		targetTdElms.each(function() {
			var id = $(this).attr('id');
			var idFirstPt = id.substring(0, id.indexOf('.') - 1);
			var idSecondPt = id.substring(id.indexOf('.') + 1, id.length);
			var idThirdPt = null;
			if (idSecondPt.indexOf('.') > 0) {
				idThirdPt = idSecondPt.substring(idSecondPt.indexOf('.') + 1, idSecondPt.length);
				idSecondPt = idSecondPt.substring(0, idSecondPt.indexOf('.') - 1);
			}
			
			var newId = idFirstPt + infoIndex + '.' + idSecondPt;
			newId = idThirdPt != null ? newId + itemIndex + '.' + idThirdPt : newId;			
			
			var newName = idFirstPt + '[' + infoIndex + '].' + idSecondPt;
			newName = idThirdPt != null ? newName + '[' + itemIndex + '].' + idThirdPt : newName;	
			
			$(this).attr('id', newId);
			$(this).attr('name', newName);
			
			// edit itemNo
			var formItem = id.substring(id.lastIndexOf('.') + 1, id.length);
			if (formItem == 'itemNo') {
				$(this).val(itemIndex + 1);
			}
		});
	});
	
	const deleteChangeRecordColor = (function() {
		// Gray out the record if the delete check was checked.
		$('#luggage-list-table').find('.css-list-chbox').change(function() {
			var parentSiblings = parentSiblings = $(this).parent('td').siblings('td');
			var parentSiblingsChildren = $(this).parent('td').siblings('td').children();
			if ($(this).prop('checked')) {
				$(this).parent('td').css('background-color', '#ccc8c8');
				parentSiblings.css('background-color', '#ccc8c8');
				parentSiblings.css('color', '#61646d');
				parentSiblingsChildren.css('background-color', '#ccc8c8');	
				parentSiblingsChildren.css('color', '#61646d');	
			} else {
				$(this).parent('td').css('background-color', '#fff');
				parentSiblings.css('background-color', '#fff');
				parentSiblings.css('color', '#000');
				parentSiblingsChildren.css('background-color', '#fff');
				parentSiblingsChildren.css('color', '#000');
			}
		});
	});
	
	const modifyLuggageRecordNo = (function() {
		var recordCnt = 1;
		$('#luggage-list-table tbody').find('.luggage-record-no').each(function() {
			$(this).children('input').val(recordCnt);
			$(this).text(recordCnt);
			
			var emitId = $(this).nextAll('.luggage-item-emit').children('input').attr('id');
			var targetEmitId = emitId.substring(0, emitId.lastIndexOf('-') + 1); 
			$(this).nextAll('.luggage-item-emit').children('input').attr('id', targetEmitId + recordCnt);
			$(this).nextAll('.luggage-item-emit').children('label').attr('for', targetEmitId + recordCnt);
			recordCnt++;
		});
	});
	
	const setLuggageInfoItem = (function() {
		// All bagNo element list
		var bagNoElmList = new Array();
		// All bagNo list 
		var bagNos = new Array();
		// Unique bagNo list
		var uniqueBagNoElmList = new Array();
		
		// delete html if the delete check is checked
		$('#luggage-list-table tbody tr').find('[id$=".bagNo"]').each(function() {
			if ($(this).parent('td.luggage-bag-no').nextAll('.luggage-item-emit').children('input').prop('checked')) {
				$(this).parents('tr').nextAll('input').each(function() {
					delHtml($(this));					
				});
				delHtml($(this).parents('tr'));
			}
		});
		
		var bagNoElmList = $('#luggage-list-table tbody tr').find('[id$=".bagNo"]');
		$.each(bagNoElmList, function() {
			uniqueBagNoElmList.push($(this).val());
		});
		// create unique bagNo list and sort by bagNo asc
		uniqueBagNoElmList = Array.from(new Set(uniqueBagNoElmList));
		uniqueBagNoElmList = uniqueBagNoElmList.sort(function(x, y) {
			// sort by asc
			return (x > y) ? 1 : -1;
		});
		
		// sort item by its record number
		var sortedLuggageItemElmList = bagNoElmList.sort(function(x, y) {
			var xRecordNo = Number(x.parentElement.previousElementSibling.textContent);
			var yRecordNo = Number(y.parentElement.previousElementSibling.textContent);
			
			// sort by Bag No string asc
			var sortResult = $(x).val() > $(y).val() ? 1 : -1;
			// sort by Record No string asc
			if ($(x).val() == $(y).val()) {
				sortResult = xRecordNo > yRecordNo ? 1 : -1;
			}
			return sortResult;
		});
		
		let baseInfoIndex = 0;
		sortedLuggageItemElmList.each(function(idx, elm) {
			let infoIndex = 0;
			let itemIndex = 0;
//			var elmBagNo = ($(this).val() == '-') ? 0 : Number($(this).val());
			var elmBagNo = ($(this).val());
			
			// set infoIndex and itemIndex
			if (uniqueBagNoElmList.length > 0) {
				for (let i = 0; i < uniqueBagNoElmList.length; i++) {
					if (elmBagNo == uniqueBagNoElmList[i]) {
						// set infoindex based on the number of bagNo 
						infoIndex = i;
					}
				}
			}
			for (var bagNo of bagNos) {
				if (elmBagNo == bagNo) {
					itemIndex++;
				}
			}
			
			// add Bag No to the list 
			bagNos.push(elmBagNo);
			rewriteFormIndexes($(this).parents('tr'), infoIndex, itemIndex);
		});
	});
	
	const confirmEmptyEnter = (function() {
		$('#js-modal-confirm-empty-enter-btns').children('button').click(function(elm) {
			if (modalConfirmEmptyEnter($(this).val())) {
				$('input[id^="submit"]').trigger('click');;
			} else {
				$('#js-modal-confirm-empty-enter').css('display', 'none');		
				return false;
			}			
		});
	});
	
	// method right before submit
	const beforeSubmit = (function() {
		$('input[id^="submit"]').click(function() {
			modifyLuggageRecordNo();
			var url = '';
			
			// set luggage info and item
			setLuggageInfoItem();

			if ($(this).attr('id') == 'submit') {
				// if the form is empty, show the modal to warn.
				if (!$('#luggage-list-table').children('tbody').children('tr').length) {
					delHtml($('#luggage-list-table').children('tbody').children());
					
					if ($('#js-modal-confirm-empty-enter').css('display') == 'none') {
						$('#js-modal-confirm-empty-enter').css('display', 'block');						
					}
					// not continue the submit process if except for yes
					if ($('#confirm-empty-enter-val').val() != "0") {
						return false;						
					}
				}
				// if the button is not submit button
				url = '/tripPlan/travel/tripPlans/createRoute/prepLuggage/confirmPlans';
			} else {
				if ($(this).attr('id') == 'submit-back') {
					// if the button is submit-back button
					url = '/tripPlan/travel/tripPlans/createRoute?back';
				}
			}			
			
			// rewrite the action
			$('form').attr('action', url);				
			
			$('form').submit();
		});
	});
	
	const setEvent = (function() {
		modifyLuggageRecordNo();
		addRecordBtn();
		handleSortPane();
		selectLuggageKeyword();
		selectLuggageItem();
		changeSelectedBagNo();
		deleteChangeRecordColor();
		confirmEmptyEnter();
		confirm();
		beforeSubmit();
	});
	
	$(function(){
		setEvent();
		$('#search-button').trigger('click');
		location.href="#";
	});
});

$(function(){
    createRoute();
});