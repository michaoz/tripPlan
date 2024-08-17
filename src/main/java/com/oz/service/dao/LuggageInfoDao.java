package com.oz.service.dao;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.oz.bean.common.TripPlansCommonForm;
import com.oz.entity.LuggageInfoEntity;
import com.oz.entity.LuggageItemEntity;
import com.oz.entity.SpotInfoEntity;

/**
 * DAO class for createRoute
 * @author abmg3
 *
 */
@Repository
public interface LuggageInfoDao {

	final Connection conn = null;

	/**
	 * select createRoute data from DB
	 * @param form
	 */
	abstract public List<LuggageInfoEntity> selectLuggageInfoByPraimaryKey(String condition, String[] paramArry) throws SQLException;

	/**
	 * select createRoute data from DB
	 * @param form
	 */
	abstract public List<LuggageItemEntity> selectLuggageItemByPraimaryKey(String[] conditionColumns, String[] paramArry) throws SQLException;

	
	/**
	 * insert createRoute data into DB
	 * @param form
	 */
	abstract public void insert(TripPlansCommonForm form) throws SQLException;
	
	abstract public void delete(TripPlansCommonForm form, String condition, String updDateParam) throws SQLException;
}
