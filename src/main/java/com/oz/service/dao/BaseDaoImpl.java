package com.oz.service.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import com.oz.consts.DBConst;

//@PropertySource({"classpath:datasource.properties"})
@Service
public class BaseDaoImpl implements BaseDao{

	@Autowired
    private Environment env;
	
	private Connection conn = null;
	
	/**
	 * {@inheritDoc}
	 */
	public Connection getConnection(Connection conn) throws SQLException {
		
		try {
			conn = DriverManager.getConnection(DBConst.URL, DBConst.USER, DBConst.PASS);
		} catch (SQLException e) {
			e.printStackTrace();
			throw e;
		}
		return conn;
	}
	
	/**
	 * {@inheritDoc}
	 */
	public void closeConnection(Connection conn) throws SQLException {
		try {
			if (conn != null) {
				conn.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
			throw e;
		}
	}

	/**
	 * {@inheritDoc}
	 */
	public void beginTransaction(boolean autocommitFlg) throws SQLException {
		conn.setAutoCommit(autocommitFlg);
	}
	
	/**
	 * {@inheritDoc}
	 */
	public void endTransaction() throws SQLException {
		// commit transaction
		conn.commit();
		
		// reset autocommit to default
		conn.setAutoCommit(true);
	}
	
	/**
	 * {@inheritDoc}
	 */
	public void rollback() throws SQLException {
		conn.rollback();
		// reset autocommit to default
		conn.setAutoCommit(true);
	}
	
	/**
	 * {@inheritDoc}
	 */
	public void closeStatement(PreparedStatement pstmt, ResultSet rs) throws SQLException {
		if (rs != null) {
			rs.close();
			rs = null;
		}
		
		if (pstmt != null) {
			pstmt.close();
			pstmt = null;
		}
	}
}
