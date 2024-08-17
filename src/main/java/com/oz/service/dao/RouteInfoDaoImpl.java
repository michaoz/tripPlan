package com.oz.service.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.ObjectUtils;

import com.oz.bean.common.SpotInfo;
import com.oz.bean.common.TripPlansCommonForm;
import com.oz.consts.CommonConstant;
import com.oz.entity.SpotInfoEntity;

@Repository
public class RouteInfoDaoImpl implements RouteInfoDao {

	/** user id */
	private static final String USER_ID = "UIRI001";
	
	@Autowired
	private BaseDao baseDao;
	
	protected Connection conn = null;

	private PreparedStatement pstmt = null;
	
	private ResultSet rs = null;
	
	@Override
	public List<SpotInfoEntity> select(TripPlansCommonForm form, String condition, Object[] paramArry) throws SQLException {
		
		StringBuilder sb = new StringBuilder();
		sb.append("SELECT * FROM T_ROUTE_INFO ");
		if (condition != null) {
			sb.append(condition);
		}
		if (paramArry != null && paramArry.length > 0) {
			// TODO
		}
		sb.append(";");
		
		List<SpotInfoEntity> resultList = new ArrayList<>();
		try {
			// get db connection
			conn = baseDao.getConnection(conn);
			// get statement
			pstmt = conn.prepareStatement(sb.toString());
			for (Object param : paramArry) {
				int i = 0;
				pstmt.setString(++i, (String) param);				
			}
			
			// execute sql
			rs = pstmt.executeQuery();
			
			while (rs.next()) {
				SpotInfoEntity resultEntity = new SpotInfoEntity();
				
			    resultEntity.setTripPlanName(rs.getString("TRIP_PLAN_NAME"));
			    resultEntity.setRecordNum(rs.getInt("RECORD_NUM"));
				resultEntity.setSpotName(rs.getString("SPOT_NAME"));
				resultEntity.setCity(rs.getString("CITY"));
				resultEntity.setAddress(rs.getString("ADDRESS"));
				resultEntity.setLatitude(rs.getString("LATITUDE"));
				resultEntity.setLongitude(rs.getString("LONGITUDE"));
				resultEntity.setLeafletId(rs.getString("LEAFLET_ID"));
				resultEntity.setGeoType(rs.getString("GEO_TYPE"));
				resultEntity.setInsUserId(rs.getString("INS_USER_ID"));
				resultEntity.setInsDate(rs.getTimestamp("INS_DATE"));
				resultEntity.setUpdUserId(rs.getString("UPD_USER_ID"));
				resultEntity.setUpdDate(rs.getTimestamp("UPD_DATE"));
				
				resultList.add(resultEntity);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			baseDao.closeConnection(conn);
			baseDao.closeStatement(pstmt, rs);
		}
		return resultList;
	}
	
	@Override
	public List<String> selectTripPlanName(TripPlansCommonForm form, String condition, Object[] paramArry, boolean getFirstFlg) throws SQLException {
		
		StringBuilder sb = new StringBuilder();
		sb.append("SELECT TRIP_PLAN_NAME ");
		if(getFirstFlg) {
			sb.append("FROM T_ROUTE_INFO ");
		} else {
			sb.append("FROM (SELECT * FROM T_ROUTE_INFO ORDER BY UPD_DATE DESC) AS sub ");			
		}
		if (condition != null) {
			if (paramArry == null || paramArry.length == 0) {
				condition = condition.replace("?", "\"\"");
			}
			sb.append(condition);
		}
		sb.append(";");
		
		List<String> tripPlanNameList = new ArrayList<>();
		try {
			// get db connection
			conn = baseDao.getConnection(conn);
			
			// get statement
			pstmt = conn.prepareStatement(sb.toString());
			if (!ObjectUtils.isEmpty(paramArry)) {
				pstmt.setString(1, (String) paramArry[0]);				
			}
						
			// execute sql
			rs = pstmt.executeQuery();
			
			while(rs.next()) {
				tripPlanNameList.add(rs.getString("TRIP_PLAN_NAME"));
				if (getFirstFlg) {
					// get only the first result
					break;
				}
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			baseDao.closeConnection(conn);
			baseDao.closeStatement(pstmt, rs);
		}
		return tripPlanNameList;
	}
		
	@Override
	public void insert(TripPlansCommonForm form) throws SQLException {
		
		// get current timestamp
		Timestamp systemTimestamp = new Timestamp(System.currentTimeMillis());
		
		StringBuilder sql = new StringBuilder();
		
		sql.append("INSERT INTO T_ROUTE_INFO");
		sql.append("( TRIP_PLAN_NAME ");
		sql.append(", RECORD_NUM ");
		sql.append(", SPOT_NAME ");
		sql.append(", CITY ");
		sql.append(", ADDRESS ");
		sql.append(", LATITUDE ");
		sql.append(", LONGITUDE ");
		sql.append(", LEAFLET_ID ");
		sql.append(", GEO_TYPE ");
		sql.append(", INS_USER_ID ");
		sql.append(", INS_DATE ");
		sql.append(", UPD_USER_ID ");
		sql.append(", UPD_DATE ) ");
		sql.append("VALUES ");
		sql.append("(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) ");
		sql.append("; ");
		
		List<SpotInfo> spotList = form.getSpotList();
		try {
			// get db connection
			conn = baseDao.getConnection(conn);
			
			// get statement
			pstmt = conn.prepareStatement(sql.toString());
			
			for (SpotInfo spotInfo : spotList) {
				int i = 0;
				pstmt.setString(++i, form.getTripPlanName());
				pstmt.setInt(++i, spotInfo.getRecordNum());
				pstmt.setString(++i, spotInfo.getSpotName());
				pstmt.setString(++i, spotInfo.getCity());
				pstmt.setString(++i, spotInfo.getAddress());
				pstmt.setString(++i, spotInfo.getLatitude());
				pstmt.setString(++i, spotInfo.getLongitude());
				pstmt.setString(++i, spotInfo.getLeafletId());
				pstmt.setString(++i, spotInfo.getGeoType());
				pstmt.setString(++i, USER_ID);
				pstmt.setTimestamp(++i, systemTimestamp);
				pstmt.setString(++i, USER_ID);
				pstmt.setTimestamp(++i, systemTimestamp);
				
				pstmt.addBatch();
			}
			
			int[] result = pstmt.executeBatch();
			// result
			Arrays.stream(result).forEach(System.out::println);
			
			// INSERT結果が取得できない場合は例外処理を行う
			for (int resultCount : result) {
				if (resultCount <= 0) {
					throw new SQLException();
				}
			}
			
			// Set the latest data to model to synchronize with DB data
			SimpleDateFormat sdf = new SimpleDateFormat(CommonConstant.DATETIMEFORMAT_HYPHEN_COLON);

			spotList.forEach(s -> s.setInsUserId(USER_ID));
			spotList.forEach(s -> s.setInsDate(sdf.format(systemTimestamp)));	
			spotList.forEach(s -> s.setUpdUserId(USER_ID));
			spotList.forEach(s -> s.setUpdDate(sdf.format(systemTimestamp)));
			
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			baseDao.closeConnection(conn);
			baseDao.closeStatement(pstmt, rs);
		}
	}
	
	@Override
	public void delete(TripPlansCommonForm form, String condition, String updDateParam) throws SQLException {
		// get current timestamp
		Timestamp systemTimestamp = new Timestamp(System.currentTimeMillis());
		
		StringBuilder sql = new StringBuilder();
		sql.append("DELETE FROM T_ROUTE_INFO ");
		sql.append("WHERE ");
		sql.append("TRIP_PLAN_NAME = ? ");
		sql.append("AND INS_DATE < ? ");
		if (condition != null) {
			// UPD_DATE
			sql.append("AND " + condition + " ");
		}
		sql.append(";");
		
		List<SpotInfo> spotList = form.getSpotList();

		try {
			// get db connection
			conn = baseDao.getConnection(conn);
			
			// get statement
			pstmt = conn.prepareStatement(sql.toString());
			
			int i = 0;
			pstmt.setString(++i, form.getTripPlanName());
			pstmt.setTimestamp(++i, Timestamp.valueOf(form.getSpotList().get(0).getInsDate()));
			if (!StringUtils.isEmpty(updDateParam)) {
				pstmt.setTimestamp(++i, Timestamp.valueOf(form.getSpotList().get(0).getUpdDate()));
			}
						
			// Set the latest data to model to synchronize with DB data
			SimpleDateFormat sdf = new SimpleDateFormat(CommonConstant.DATETIMEFORMAT_HYPHEN_COLON);
			spotList.forEach(s -> s.setUpdUserId(USER_ID));
			spotList.forEach(s -> s.setUpdDate(sdf.format(systemTimestamp)));
			
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			baseDao.closeConnection(conn);
			baseDao.closeStatement(pstmt, rs);
		}
	}

	@Override
	public void update(List<SpotInfo> spotInfoEntityList) throws SQLException {
		SimpleDateFormat sdf = new SimpleDateFormat(CommonConstant.DATETIMEFORMAT_HYPHEN_COLON);
		
		// get current timestamp
		Timestamp systemTimestamp = new Timestamp(System.currentTimeMillis());

		StringBuilder sql = new StringBuilder();
		sql.append("UPDATE T_ROUTE_INFO ");
		sql.append("SET RECORD_NUM = ? ");
		sql.append(", SPOT_NAME = ? ");
		sql.append(", CITY = ? ");
		sql.append(", ADDRESS = ? ");
		sql.append(", LATITUDE = ? ");
		sql.append(", LONGITUDE = ? ");
		sql.append(", LEAFLET_ID = ? ");
		sql.append(", GEO_TYPE = ? ");
		sql.append(", UPD_USER_ID = ? ");
		sql.append(", UPD_DATE = ? ");
		sql.append("WHERE ");
		sql.append("TRIP_PLAN_NAME = ? AND INS_DATE = ? AND UPD_DATE = ? ");		
		sql.append(";");
		
		try {
			// get db connection
			conn = baseDao.getConnection(conn);

			// get statement
			pstmt = conn.prepareStatement(sql.toString());
			
			for (SpotInfo entity : spotInfoEntityList) {
				int i = 0;
				// SET value
				pstmt.setInt(++i, entity.getRecordNum());
				pstmt.setString(++i, entity.getSpotName());
				pstmt.setString(++i, entity.getCity());
				pstmt.setString(++i, entity.getAddress());
				pstmt.setString(++i, entity.getLatitude());
				pstmt.setString(++i, entity.getLongitude());
				pstmt.setString(++i, entity.getLeafletId());
				pstmt.setString(++i, entity.getGeoType());
				pstmt.setString(++i, USER_ID);
				pstmt.setTimestamp(++i, systemTimestamp);
				
				// condition parameter
				pstmt.setString(++i, entity.getTripPlanName());
				pstmt.setTimestamp(++i, Timestamp.valueOf(entity.getUpdDate()));
				pstmt.setTimestamp(++i, Timestamp.valueOf(entity.getInsDate()));
				
				pstmt.addBatch();
			}
			
			int[] result = pstmt.executeBatch();
			// result
			Arrays.stream(result).forEach(System.out::println);
			
			// UPDATE結果が取得できない場合は例外処理を行う
			for (int resultCount : result) {
				if (resultCount <= 0) {
					throw new SQLException();
				}
			}
			
			// Set the latest data to model to synchronize with DB data
			spotInfoEntityList.forEach(s -> s.setInsUserId(USER_ID));
			spotInfoEntityList.forEach(s -> s.setInsDate(sdf.format(systemTimestamp)));
			spotInfoEntityList.forEach(s -> s.setUpdUserId(USER_ID));
			spotInfoEntityList.forEach(s -> s.setUpdDate(sdf.format(systemTimestamp)));
			
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			baseDao.closeConnection(conn);
			baseDao.closeStatement(pstmt, rs);
		}
	}
}
