package com.oz.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.oz.bean.common.SpotInfo;
import com.oz.bean.common.TripPlansCommonForm;
import com.oz.entity.SpotInfoEntity;

public interface TripPlanService {

	public List<String> getTripPlanNameList();
	
	public boolean searchTripPlanName(String tripPlanName);

	public void insertTripPlan(TripPlansCommonForm form);
}
