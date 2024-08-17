package com.oz.service.dao;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.oz.bean.common.TripPlansCommonForm;
import com.oz.bean.common.TripPlan;
import com.oz.entity.SpotInfoEntity;

/**
 * DAO class for createRoute
 * @author abmg3
 *
 */
@Repository
public interface TripPlanDao {

	final Connection conn = null;

	/**
	 * select TripPlanName data from DB
	 * @param form
	 */
	abstract public List<String> selectTripPlanName(TripPlansCommonForm form, String condition, Object[] paramArry, boolean getFirstFlg) throws SQLException;
//	abstract public String selectTripPlanName(TripPlansCommonForm form, String condition, Object[] paramArry) throws SQLException;
		
	/**
	 * insert createRoute data into DB
	 * @param form
	 */
	abstract public void insert(TripPlan tripPlanBean) throws SQLException;
	
}
