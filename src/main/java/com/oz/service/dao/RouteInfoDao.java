package com.oz.service.dao;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.oz.bean.common.SpotInfo;
import com.oz.bean.common.TripPlansCommonForm;
import com.oz.entity.SpotInfoEntity;

/**
 * DAO class for createRoute
 * @author abmg3
 *
 */
@Repository
public interface RouteInfoDao {

	final Connection conn = null;

	/**
	 * select createRoute data from DB
	 * @param form
	 */
	abstract public List<SpotInfoEntity> select(TripPlansCommonForm form, String condition, Object[] paramArry) throws SQLException;
	
	/**
	 * select createRoute data from DB
	 * @param form
	 */
	abstract public List<String> selectTripPlanName(TripPlansCommonForm form, String condition, Object[] paramArry, boolean getFirstFlg) throws SQLException;
	
	/**
	 * insert createRoute data into DB
	 * @param form
	 */
	abstract public void insert(TripPlansCommonForm form) throws SQLException;

	abstract public void delete(TripPlansCommonForm form, String condition, String updDateParam) throws SQLException;

//	abstract public void update(List<SpotInfoEntity> spotInfoEntityList) throws SQLException;
	abstract public void update(List<SpotInfo> spotInfoEntityList) throws SQLException;
	
}
