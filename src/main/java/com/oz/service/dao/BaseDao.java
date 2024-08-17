package com.oz.service.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import com.oz.bean.common.TripPlansCommonForm;
import com.oz.consts.DBConst;

@Service
public interface BaseDao {

	/**
	 * get db connection 
	 * @throws SQLException
	 */
	abstract public Connection getConnection(Connection conn) throws SQLException;
	
	/**
	 * close db connection
	 * @throws SQLException
	 */
	abstract public void closeConnection(Connection conn) throws SQLException;

	/**
	 * begin transaction
	 * @param autocommitFlg オートコミット有効化(true)/無効化(false)
	 * @throws SQLException
	 */
	abstract public void beginTransaction(boolean autocommitFlg) throws SQLException;
	
	/**
	 * end transaction
	 * @throws SQLException
	 */
	abstract public void endTransaction() throws SQLException;
	
	/**
	 * rollback
	 * @throws SQLException
	 */
	abstract public void rollback() throws SQLException;
	
	/**
	 * close statement
	 * @param pstmt
	 * @param rs
	 * @throws SQLException
	 */
	abstract public void closeStatement(PreparedStatement pstmt, ResultSet rs) throws SQLException;
}
