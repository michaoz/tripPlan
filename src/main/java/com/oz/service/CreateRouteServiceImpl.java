package com.oz.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.ObjectUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.oz.bean.common.SpotInfo;
import com.oz.bean.common.TripPlansCommonForm;
import com.oz.entity.SpotInfoEntity;
import com.oz.service.dao.BaseDao;
import com.oz.service.dao.RouteInfoDao;

@Component
@Service
public class CreateRouteServiceImpl implements CreateRouteService {
//	@Autowired
//	ModelMapper modelMapper;
	
	@Autowired
	BaseDao baseDao;
	
	@Autowired
	RouteInfoDao routeInfoDao;

	public List<String> getTripPlanNameList() {
		List<String> resultTripPlanNameList = null;
		
		String condition = "GROUP BY TRIP_PLAN_NAME ";
		try {
			resultTripPlanNameList = routeInfoDao.selectTripPlanName(null, condition, null, false);
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
			resultTripPlanNameList = routeInfoDao.selectTripPlanName(null, condition, new Object[]{tripPlanName}, true);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		if (resultTripPlanNameList.size() > 0) {
			hasTripPlanName = true;
		}

		return hasTripPlanName;		
	}
	
	public List<SpotInfo> selectRouteInfo(TripPlansCommonForm form) {
		List<SpotInfo> resultspotInfoList = new ArrayList<>();
		List<SpotInfoEntity> resultList = new ArrayList<>();
		
		String condition = "WHERE TRIP_PLAN_NAME = ? AND UPD_DATE = ( SELECT MAX(UPD_DATE) FROM T_ROUTE_INFO ) ";
		try {
			// get the latest data
			resultList = routeInfoDao.select(form, condition, new Object[]{form.getTripPlanName()});
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		if (ObjectUtils.isNotEmpty(resultList)) {
			for (int i = 0; i < resultList.size(); i++) {
				SpotInfoEntity sie = resultList.get(i);
				
	        	// Mapping modelMapper
				ModelMapper modelMapper = new ModelMapper(); 
				SpotInfo si = modelMapper.map(sie, SpotInfo.class);
//				SpotInfo si2 = new SpotInfo();
//				modelMapper.map(sie, si2);
	        	
				resultspotInfoList.add(si);
	    	}			
		}
		return resultspotInfoList;		
	}
			
	public void insertDeleteRouteInfo(TripPlansCommonForm form) {
		this.insertRouteInfo(form);
		this.deleteRouteInfo(form, form.getSpotList().get(0).getUpdDate());
	}
	
	private void insertRouteInfo(TripPlansCommonForm form) {
		// DB登録
		try {
			routeInfoDao.insert(form);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	private void deleteRouteInfo(TripPlansCommonForm form, String updDateParam) {
		String condition = "UPD_DATE <= ? ";
		try {
			routeInfoDao.delete(form, condition, updDateParam);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	public void updateRouteInfo(TripPlansCommonForm form) {
		ModelMapper mapper = new ModelMapper();
		List<SpotInfoEntity> spotInfoEntityList = new ArrayList<>();

		form.getSpotList().forEach(si -> spotInfoEntityList.add(mapper.map(si, SpotInfoEntity.class)));
		
		// DB登録
		try {
			routeInfoDao.update(form.getSpotList());
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		List<SpotInfo> newSpotInfoList = new ArrayList<>();
		spotInfoEntityList.forEach(sie -> newSpotInfoList.add(mapper.map(sie, SpotInfo.class)));
		form.setSpotList(newSpotInfoList);
	}
	
	private SpotInfoEntity spotInfoToEntity(SpotInfo si) {
		SpotInfoEntity sie = new SpotInfoEntity();
		
		sie.setTripPlanName(si.getTripPlanName());
		sie.setRecordNum(si.getRecordNum());
		sie.setSpotName(si.getSpotName());
		sie.setCity(si.getCity());
		sie.setAddress(si.getAddress());
		/** geo info */
		sie.setLatitude(si.getLatitude());
		sie.setLongitude(si.getLongitude());
		sie.setLeafletId(si.getLeafletId());
		sie.setGeoType(si.getGeoType());
		sie.setInsUserId(si.getInsUserId());
		sie.setUpdUserId(si.getUpdUserId());
		
		return sie;
	}
}
