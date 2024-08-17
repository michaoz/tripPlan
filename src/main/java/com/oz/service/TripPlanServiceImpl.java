package com.oz.service;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.oz.bean.common.TripPlansCommonForm;
import com.oz.bean.common.TripPlan;
import com.oz.service.dao.BaseDao;
import com.oz.service.dao.TripPlanDao;

@Component
@Service
public class TripPlanServiceImpl implements TripPlanService {			
	@Autowired
	BaseDao baseDao;
	
	@Autowired
	TripPlanDao tripPlanDao;

	public List<String> getTripPlanNameList() {
		List<String> resultTripPlanNameList = null;
		
		String condition = "GROUP BY TRIP_PLAN_NAME ";
		try {
			resultTripPlanNameList = tripPlanDao.selectTripPlanName(null, condition, null, false);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return resultTripPlanNameList;
	}
	
	public boolean searchTripPlanName(String tripPlanName) {
		// flg if there's the trip plan name in DB
		boolean hasTripPlanName = false;
		
		String condition = "WHERE TRIP_PLAN_NAME = ? ";
    	List<String> resultTripPlanNameList = null;
		try {
			resultTripPlanNameList = tripPlanDao.selectTripPlanName(null, condition, new Object[]{tripPlanName}, true);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		if (resultTripPlanNameList.size() > 0) {
			hasTripPlanName = true;
		}

		return hasTripPlanName;		
	}
	
	public void insertTripPlan(TripPlansCommonForm form) {
		TripPlan tripPlanBean = new TripPlan();
		tripPlanBean.setTripPlanName(form.getTripPlanName());
		
		// DB登録
		try {
			tripPlanDao.insert(tripPlanBean);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
