package com.oz.service.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.ObjectUtils;
import com.oz.bean.common.TripPlansCommonForm;
import com.oz.bean.common.TripPlan;

@Repository
public class TripPlanDaoImpl implements TripPlanDao {

	/** user id */
	private static final String USER_ID = "UIRI001";
	
	@Autowired
	private BaseDao baseDao;
	
	protected Connection conn = null;

	private PreparedStatement pstmt = null;
	
	private ResultSet rs = null;
	
	private static final int TRIP_PLAN_BEAN_FIELD_COUNT = 5;
	
	@Override
	public List<String> selectTripPlanName(TripPlansCommonForm form, String condition, Object[] paramArry, boolean getFirstFlg) throws SQLException {
		
		StringBuilder sb = new StringBuilder();
		sb.append("SELECT TRIP_PLAN_NAME ");
		if(getFirstFlg) {
			sb.append("FROM T_TRIP_PLAN ");
		} else {
			sb.append("FROM (SELECT * FROM T_TRIP_PLAN ORDER BY UPD_DATE DESC) AS sub ");			
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
	public void insert(TripPlan tripPlanBean) throws SQLException {
		
		// get current timestamp
		Timestamp systemTimestamp = new Timestamp(System.currentTimeMillis());
		
		StringBuilder sql = new StringBuilder();
		
		sql.append("INSERT INTO T_TRIP_PLAN");
		sql.append("( TRIP_PLAN_NAME ");
		sql.append(", INS_USER_ID ");
		sql.append(", INS_DATE ");
		sql.append(", UPD_USER_ID ");
		sql.append(", UPD_DATE ) ");
		sql.append("VALUES ");
		sql.append("(?, ?, ?, ?, ?) ");
		
		sql.append(";");
		
		try {
			// get db connection
			conn = baseDao.getConnection(conn);
			
			// get statement
			pstmt = conn.prepareStatement(sql.toString());
			
			for (int i = 0; i < TRIP_PLAN_BEAN_FIELD_COUNT; i++) {				
				pstmt.setString(++i, tripPlanBean.getTripPlanName());
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
			tripPlanBean.setInsUserId(USER_ID);
			tripPlanBean.setInsDate(systemTimestamp);	
			tripPlanBean.setUpdUserId(USER_ID);
			tripPlanBean.setUpdDate(systemTimestamp);
						
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			baseDao.closeConnection(conn);
			baseDao.closeStatement(pstmt, rs);
		}
	}
	
}
