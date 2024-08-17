package com.oz.service.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.oz.bean.common.LuggageInfo;
import com.oz.bean.common.LuggageItem;
import com.oz.bean.common.TripPlansCommonForm;
import com.oz.consts.CommonConstant;
import com.oz.entity.LuggageInfoEntity;
import com.oz.entity.LuggageItemEntity;

@Repository
public class LuggageInfoDaoImpl implements LuggageInfoDao {

	/** user id */
	private static final String USER_ID = "UILI001";
	
	@Autowired
	private BaseDao baseDao;
	
	protected Connection conn = null;

	private PreparedStatement pstmt = null;

	private ResultSet rs = null;
	
	@Override
	public List<LuggageInfoEntity> selectLuggageInfoByPraimaryKey(String condition, String[] pkParamArry) {
		StringBuilder sb = new StringBuilder();
		sb.append("SELECT * FROM T_LUGGAGE_INFO ");
		if (condition != null) {
			sb.append(condition);
		}
//		sb.append("WHERE TRIP_PLAN_NAME = '" + pkParamArry[0] + "' ");
		sb.append(";");
		
		List<LuggageInfoEntity> resultList = new ArrayList<>();
		try {
			// get db connection
			conn = baseDao.getConnection(conn);
			// get statement
			pstmt = conn.prepareStatement(sb.toString());
			if (pkParamArry != null && pkParamArry.length > 0) {
				for (int i = 0; i < pkParamArry.length; i++) {
					if (!StringUtils.isEmpty(pkParamArry[i])) {
						if (i == 1) {
							pstmt.setInt(i + 1, Integer.valueOf(pkParamArry[i]));
						}
						pstmt.setString(i + 1, pkParamArry[i]);
					}		
				}
			}
			
			// execute sql
			rs = pstmt.executeQuery();
						
			while (rs.next()) {				
				LuggageInfoEntity resultEntity = new LuggageInfoEntity();
				
			    resultEntity.setTripPlanName(rs.getString("TRIP_PLAN_NAME"));
				resultEntity.setLuggageCount(rs.getInt("LUGGAGE_COUNT"));
				resultEntity.setBagNo(rs.getString("BAG_NO"));
				resultEntity.setLuggagePrepaedFlg(rs.getBoolean("LUGGAGE_PREPARED_FLG"));
				resultEntity.setInsUserId(rs.getString("INS_USER_ID"));
				resultEntity.setInsDate(rs.getTimestamp("INS_DATE"));
				resultEntity.setUpdUserId(rs.getString("UPD_USER_ID"));
				resultEntity.setUpdDate(rs.getTimestamp("UPD_DATE"));
				
				resultList.add(resultEntity);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				baseDao.closeConnection(conn);
				baseDao.closeStatement(pstmt, rs);
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return resultList;
	}
	
	@Override
	public List<LuggageItemEntity> selectLuggageItemByPraimaryKey(String[] conditionColumns, String[] pkParamArry) {
		StringBuilder sb = new StringBuilder();
		sb.append("SELECT * FROM T_LUGGAGE_ITEM ");
		List<Integer> paramIndexes = new ArrayList<>();
		for (int i = 0; i < conditionColumns.length; i++) {
			if (!StringUtils.isEmpty(conditionColumns[i])) {
				// set a condition column
				sb.append(i == 0 ? "WHERE " : "AND ");
				sb.append(conditionColumns[i] + " = ? ");
				
				paramIndexes.add(i);
			}
		}
		sb.append(";");
		
		List<LuggageItemEntity> resultList = new ArrayList<>();
		try {
			// get db connection
			conn = baseDao.getConnection(conn);
			// get statement
			pstmt = conn.prepareStatement(sb.toString());

			// set parameters
			for (int j = 0; j < paramIndexes.size(); j++) {
				if (paramIndexes.get(j) == 1) {
					// luggage number
					pstmt.setInt(j + 1, Integer.valueOf(pkParamArry[paramIndexes.get(j)]));
				} else if (paramIndexes.get(j) == 3) {
					SimpleDateFormat sdf = new SimpleDateFormat(CommonConstant.DATETIMEFORMAT_HYPHEN_COLON);
					// ins date
					pstmt.setTimestamp(j + 1, Timestamp.valueOf(pkParamArry[paramIndexes.get(j)]));
				} else {
					pstmt.setString(j + 1, pkParamArry[paramIndexes.get(j)]);					
				}
			}
			
			// execute sql
			rs = pstmt.executeQuery();
			while (rs.next()) {				
				LuggageItemEntity resultEntity = new LuggageItemEntity();
				resultEntity.setTripPlanName(rs.getString("TRIP_PLAN_NAME"));
				resultEntity.setBagNo(rs.getString("BAG_NO"));
				resultEntity.setItemNo(rs.getInt("ITEM_NO"));
				resultEntity.setItemName(rs.getString("ITEM_NAME"));
				resultEntity.setItemCount(rs.getInt("ITEM_COUNT"));
				resultEntity.setItemPreparedFlg(rs.getBoolean("ITEM_PREPARED_FLG"));
				resultEntity.setItemOwnerName(rs.getString("ITEM_OWNER_NAME"));
				resultList.add(resultEntity);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				baseDao.closeConnection(conn);
				baseDao.closeStatement(pstmt, rs);
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return resultList;
	}
	
		
	@Override
	public void insert(TripPlansCommonForm form) throws SQLException {
		
		// get current timestamp
		Timestamp systemTimestamp = new Timestamp(System.currentTimeMillis());
		
		StringBuilder sqlLuggageInfo = new StringBuilder();
		StringBuilder sqlLuggageItem = new StringBuilder();
		
		sqlLuggageInfo.append("INSERT INTO T_LUGGAGE_INFO");
		sqlLuggageInfo.append("( TRIP_PLAN_NAME ");
		sqlLuggageInfo.append(", LUGGAGE_COUNT ");
		sqlLuggageInfo.append(", BAG_NO ");
		sqlLuggageInfo.append(", LUGGAGE_PREPARED_FLG ");
		sqlLuggageInfo.append(", INS_USER_ID ");
		sqlLuggageInfo.append(", INS_DATE ");
		sqlLuggageInfo.append(", UPD_USER_ID ");
		sqlLuggageInfo.append(", UPD_DATE ");
		sqlLuggageInfo.append(") VALUES ");
		sqlLuggageInfo.append("(?, ?, ?, ?, ?, ?, ?, ? ) ");
		sqlLuggageInfo.append(";");
		
		sqlLuggageItem.append("INSERT INTO T_LUGGAGE_ITEM");
		sqlLuggageItem.append("( TRIP_PLAN_NAME ");
		sqlLuggageItem.append(", BAG_NO ");
		sqlLuggageItem.append(", ITEM_NO ");
		sqlLuggageItem.append(", ITEM_NAME ");
		sqlLuggageItem.append(", ITEM_COUNT ");
		sqlLuggageItem.append(", ITEM_PREPARED_FLG ");
		sqlLuggageItem.append(", ITEM_OWNER_NAME ");
		sqlLuggageItem.append(", INS_USER_ID ");
		sqlLuggageItem.append(", INS_DATE ");
		sqlLuggageItem.append(", UPD_USER_ID ");
		sqlLuggageItem.append(", UPD_DATE ");
		sqlLuggageItem.append(") VALUES ");
		sqlLuggageItem.append("(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) ");
		sqlLuggageItem.append(";");
		
		Object[][] params = new Object[form.getLuggageInfoList().size()][];
		List<LuggageInfo> luggageInfoList = form.getLuggageInfoList();
		
		String condition = null;
		
		try {
			// get db connection
			conn = baseDao.getConnection(conn);
			
			/* INSERT INTO T_LUGGAGE_INFO */
			// get statement
			pstmt = conn.prepareStatement(sqlLuggageInfo.toString());
			
			for (LuggageInfo luggageInfo : luggageInfoList) {
				int i = 0;
				pstmt.setString(++i, form.getTripPlanName());
				pstmt.setInt(++i, luggageInfo.getLuggageCount());
				pstmt.setString(++i, luggageInfo.getBagNo());
				pstmt.setBoolean(++i, luggageInfo.isLuggagePrepaedFlg());
				pstmt.setString(++i, USER_ID);
				pstmt.setTimestamp(++i, systemTimestamp);
				pstmt.setString(++i, USER_ID);
				pstmt.setTimestamp(++i, systemTimestamp);
				
				pstmt.addBatch();
			}
			
			int[] resultLuggageInfo = pstmt.executeBatch();
			// result
			Arrays.stream(resultLuggageInfo).forEach(System.out::println);
			// INSERT結果が取得できない場合は例外処理を行う
			for (int resultCount : resultLuggageInfo) {
				if (resultCount <= 0) {
					throw new SQLException();
				}
			}			
			/* INSERT INTO T_LUGGAGE_INFO end */
			
			/* INSERT INTO T_LUGGAGE_ITEM */
			// get statement
			pstmt = null;
			pstmt = conn.prepareStatement(sqlLuggageItem.toString());
			
			for (LuggageInfo luggageInfo : luggageInfoList) {
				for (LuggageItem luggageItem : luggageInfo.getLuggageItemList()) {
					int i = 0;
					pstmt.setString(++i, form.getTripPlanName());
					pstmt.setString(++i, luggageInfo.getBagNo());
					pstmt.setInt(++i, luggageItem.getItemNo());
					pstmt.setString(++i, luggageItem.getItemName());
					pstmt.setInt(++i, luggageItem.getItemCount());
					pstmt.setBoolean(++i, luggageItem.isItemPreparedFlg());
					pstmt.setString(++i, luggageItem.getItemOwnerName());
					pstmt.setString(++i, USER_ID);
					pstmt.setTimestamp(++i, systemTimestamp);
					pstmt.setString(++i, USER_ID);
					pstmt.setTimestamp(++i, systemTimestamp);
					
					pstmt.addBatch();
				}
			}
			int[] resultLuggageItem = pstmt.executeBatch();
			// result
			Arrays.stream(resultLuggageItem).forEach(System.out::println);
			// INSERT結果が取得できない場合は例外処理を行う
			for (int resultCount : resultLuggageItem) {
				if (resultCount <= 0) {
					throw new SQLException();
				}
			}			
			/* INSERT INTO T_LUGGAGE_ITEM end */

			// Set the latest data to model to synchronize with DB data
			updateForm(form, systemTimestamp);			
			
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
		
		StringBuilder sqlLuggageInfo = new StringBuilder();
		sqlLuggageInfo.append("DELETE FROM T_LUGGAGE_INFO ");
		sqlLuggageInfo.append("WHERE ");
		sqlLuggageInfo.append("TRIP_PLAN_NAME = ? ");
		sqlLuggageInfo.append("AND INS_DATE < ? ");
		if (condition != null) {
			// UPD_DATE
			sqlLuggageInfo.append("AND " + condition + " ");
		}
		sqlLuggageInfo.append(";");
		
		StringBuilder sqlLuggageItem = new StringBuilder();
		sqlLuggageItem.append("DELETE FROM T_LUGGAGE_ITEM ");
		sqlLuggageItem.append("WHERE ");
		sqlLuggageItem.append("TRIP_PLAN_NAME = ? ");
		sqlLuggageItem.append("AND INS_DATE < ? ");
		if (condition != null) {
			// UPD_DATE
			sqlLuggageItem.append("AND " + condition + " ");
		}
		sqlLuggageItem.append(";");
		
		List<LuggageInfo> luggageInfoList = form.getLuggageInfoList();

		try {
			// get db connection
			conn = baseDao.getConnection(conn);
			
			// T_LUGGAGE_INFO
			pstmt = conn.prepareStatement(sqlLuggageInfo.toString());
			int i = 0;
			pstmt.setString(++i, form.getTripPlanName());
			if (ObjectUtils.isNotEmpty(form.getLuggageInfoList())) {
				pstmt.setTimestamp(++i, Timestamp.valueOf(form.getLuggageInfoList().get(0).getInsDate()));				
			} else {
				pstmt.setTimestamp(++i, systemTimestamp);
			}
			if (!StringUtils.isEmpty(updDateParam)) {
				pstmt.setTimestamp(++i, Timestamp.valueOf(form.getLuggageInfoList().get(0).getUpdDate()));
			}
			
			int result = pstmt.executeUpdate();
						
			// T_LUGGAGE_ITEM
			pstmt = conn.prepareStatement(sqlLuggageItem.toString());
			i = 0;
			pstmt.setString(++i, form.getTripPlanName());
			if (ObjectUtils.isNotEmpty(form.getLuggageInfoList())) {
				pstmt.setTimestamp(++i, Timestamp.valueOf(form.getLuggageInfoList().get(0).getInsDate()));				
			} else {
				pstmt.setTimestamp(++i, systemTimestamp);
			}
			if (!StringUtils.isEmpty(updDateParam)) {
				pstmt.setTimestamp(++i, Timestamp.valueOf(form.getLuggageInfoList().get(0).getUpdDate()));
			}
						
			result = pstmt.executeUpdate();						
			
			// Set the latest data to model to synchronize with DB data
			SimpleDateFormat sdf = new SimpleDateFormat(CommonConstant.DATETIMEFORMAT_HYPHEN_COLON);
			if (ObjectUtils.isNotEmpty(luggageInfoList)) {
				luggageInfoList.forEach(s -> s.setUpdUserId(USER_ID));
				luggageInfoList.forEach(s -> s.setUpdDate(sdf.format(systemTimestamp)));				
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			baseDao.closeConnection(conn);
			baseDao.closeStatement(pstmt, rs);
		}
	}
	
	private void updateForm(TripPlansCommonForm form, Timestamp systemTimestamp) {
		SimpleDateFormat sdf = new SimpleDateFormat(CommonConstant.DATETIMEFORMAT_HYPHEN_COLON);
		
		List<LuggageInfo> luggageInfoList = form.getLuggageInfoList();
		luggageInfoList.forEach(s -> s.setInsUserId(USER_ID));
		luggageInfoList.forEach(s -> s.setInsDate(sdf.format(systemTimestamp)));			
		luggageInfoList.forEach(s -> s.setUpdUserId(USER_ID));
		luggageInfoList.forEach(s -> s.setUpdDate(sdf.format(systemTimestamp)));

		luggageInfoList.forEach(s -> s.getLuggageItemList().forEach(lim -> lim.setInsUserId(USER_ID)));
		luggageInfoList.forEach(s -> s.getLuggageItemList().forEach(lim -> lim.setInsDate(sdf.format(systemTimestamp))));
		luggageInfoList.forEach(s -> s.getLuggageItemList().forEach(lim -> lim.setUpdUserId(USER_ID)));
		luggageInfoList.forEach(s -> s.getLuggageItemList().forEach(lim -> lim.setUpdDate(sdf.format(systemTimestamp))));
	}
	
}
