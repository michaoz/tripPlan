package com.oz.helper;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.util.StringUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.oz.bean.common.LuggageInfo;
import com.oz.bean.common.LuggageItem;
import com.oz.bean.common.SpotInfo;
import com.oz.bean.common.TripPlansCommonForm;
import com.oz.consts.CommonConstant;
import com.oz.consts.CommonConstant.LUGGAGE_KEYWORD_ITEMS;

/**
 * Helperクラス
 * Formの編集などを行う
 *
 */
@Component
public class TripPlansHelper {
	
    public void editCreateRouteForm(TripPlansCommonForm form) {
    	
    	List<SpotInfo> formSpotList = form.getSpotList();
    	
    	List<SpotInfo> newSpotList = formSpotList.stream()
    			.sorted(Comparator.comparing(fs -> fs.getRecordNum()))
    			.collect(Collectors.toList());
    	
    	/* trip plan name */
    	newSpotList.forEach(x -> x.setTripPlanName(form.getTripPlanName()));
    	
    	/* city */
    	/* address */
    	for (SpotInfo si : newSpotList) {
    		si.setCity(removeSpace(si.getCity()));
    		si.setAddress(removeSpace(si.getAddress()));
    	}
    	
    	/* Set GeoType:Point */
    	newSpotList.forEach(fs -> fs.setGeoType("Point"));

    	/* Set Latitude and Longitude (if fs.getLatLon() is not null) */
    	newSpotList.forEach(fs -> fs.setLatitude(ObjectUtils.isNotEmpty(fs.getLatLon()) ? 
    			fs.getLatLon().substring(0, fs.getLatLon().indexOf("_")) : fs.getLatitude()));
    	newSpotList.forEach(fs -> fs.setLongitude(ObjectUtils.isNotEmpty(fs.getLatLon()) ? 
    			fs.getLatLon().substring(fs.getLatLon().indexOf("_") + 1) : fs.getLongitude()));

    	/* Set Leaflet Id, Place Id*/
    	newSpotList.forEach(fs -> fs.setLeafletId(removeSpace(fs.getLeafletId())));
    	
    	form.setSpotList(newSpotList);
    }
    
    public void editPrepLuggageForm(TripPlansCommonForm form) {
    	List<LuggageInfo> luggageInfoList = form.getLuggageInfoList();
    	
    	for (LuggageInfo li : luggageInfoList) {
        	int itemsCount = 0;
    		List<LuggageItem> luggageItemList = li.getLuggageItemList();
    		
    		for (LuggageItem lim : luggageItemList) {
    			itemsCount += lim.getItemCount();
    		}
    		li.setLuggageCount(itemsCount);
    		
    		// Set Bag No from the first Luggage Item
    		li.setBagNo(luggageItemList.get(0).getBagNo());    		
    	}
    }

    public void setCreateRouteModel(TripPlansCommonForm form) {

    	// trip plan name
    	form.setTripPlanName(form.getTripPlanName());
    	if (StringUtils.isEmpty(form.getTripPlanName())) {
        	SimpleDateFormat sdfDate = new SimpleDateFormat(CommonConstant.DATEFORMAT_NO_PUNCTUATION);
        	SimpleDateFormat sdfTime = new SimpleDateFormat(CommonConstant.TIMEFORMAT_NO_PUNCTUATION);
        	String currentDate = sdfDate.format(new Date()) + "_" + sdfTime.format(new Date());
        	form.setTripPlanName("new-plan_" + currentDate);    		
    	}
    	
    	List<SpotInfo> spotList = form.getSpotList();
    	for (SpotInfo si : spotList) {
    		si.setLeafletId(removeSpace(si.getLeafletId()));
    		si.setLatitude(removeSpace(si.getLatitude()));
    		si.setLongitude(removeSpace(si.getLongitude()));
    		si.setLatLon(removeSpace(si.getLatitude()) + "_" + removeSpace(si.getLongitude()));
    		si.setGeoType(removeSpace(si.getGeoType()));
    	}

    }
    
    /**
     * 半角・全角スペースを削除する
     * @param targetStr
     * @return
     */
    private String removeSpace(String targetStr) {
    	targetStr = targetStr.replaceFirst(CommonConstant.PREFIX_MATCH + CommonConstant.REGEX_SPACE, "")
		.replaceFirst(CommonConstant.REGEX_SPACE + CommonConstant.SUFFIX_MATCH, "");
    	
    	// remove CR
    	targetStr = targetStr.replaceAll("[" + CommonConstant.REGEX_CR + "]", "");
    	// remove Tab
    	targetStr = targetStr.replaceAll("[" + CommonConstant.REGEX_TAB + "]", "");
    	// remove Space
    	targetStr = targetStr.replaceAll("[" + CommonConstant.REGEX_HALF_SPACE + "]", "");
    	
    	return targetStr;
    }
   
}