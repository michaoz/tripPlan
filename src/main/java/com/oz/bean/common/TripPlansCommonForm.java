package com.oz.bean.common;

import java.io.Serializable;
import java.util.List;

import javax.validation.Valid;

import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.stereotype.Controller;
import com.oz.bean.common.SpotInfo;
import org.springframework.web.bind.annotation.RequestMapping;

public class TripPlansCommonForm implements Serializable{
	
	/** シリアルID */
	private static final long serialVersionUID = 1L;
	
	@NotEmpty(message="{errors.empty}")
	/** trip plan name */
	private String tripPlanName;
	
	// TODO 別のフォームに移す(newPlan.jsp用)
	/** new trip plan name */
	private String newTripPlanName;
	
	/** new trip plan name */
	private String existedTripPlanName;
	
	/** new plan flg */
	private boolean newPlanFlg;
	
	/** tripPlanNameList */
	private List<String> tripPlanNameList;
	// TODO end
	
	/** spot info list */
	@Valid
	private List<SpotInfo> spotList;
	
	/** luggage info list */
	@Valid
	private List<LuggageInfo> luggageInfoList;
	
	

	public String getTripPlanName() {
		return tripPlanName;
	}

	public void setTripPlanName(String tripPlanName) {
		this.tripPlanName = tripPlanName;
	}
	
	public String getNewTripPlanName() {
		return newTripPlanName;
	}

	public void setNewTripPlanName(String newTripPlanName) {
		this.newTripPlanName = newTripPlanName;
	}

	public String getExistedTripPlanName() {
		return existedTripPlanName;
	}

	public void setExistedTripPlanName(String existedTripPlanName) {
		this.existedTripPlanName = existedTripPlanName;
	}

	public List<SpotInfo> getSpotList() {
		return spotList;
	}

	public void setSpotList(List<SpotInfo> spotList) {
		this.spotList = spotList;
	}

	public List<LuggageInfo> getLuggageInfoList() {
		return luggageInfoList;
	}

	public void setLuggageInfoList(List<LuggageInfo> luggageInfoList) {
		this.luggageInfoList = luggageInfoList;
	}

	public boolean isNewPlanFlg() {
		return newPlanFlg;
	}

	public void setNewPlanFlg(boolean newPlanFlg) {
		this.newPlanFlg = newPlanFlg;
	}

	public List<String> getTripPlanNameList() {
		return tripPlanNameList;
	}

	public void setTripPlanNameList(List<String> tripPlanNameList) {
		this.tripPlanNameList = tripPlanNameList;
	}

	
	
}
