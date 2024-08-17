package com.oz.service;

import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.codec.binary.StringUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oz.bean.common.LuggageInfo;
import com.oz.bean.common.LuggageItem;
import com.oz.bean.common.TripPlansCommonForm;
import com.oz.consts.CommonConstant;
import com.oz.entity.LuggageInfoEntity;
import com.oz.entity.LuggageItemEntity;
import com.oz.service.dao.BaseDao;
import com.oz.service.dao.LuggageInfoDao;

@Service
public class PrepLuggageServiceImpl implements PrepLuggageService {
	
	@Autowired
	BaseDao baseDao;
	
	@Autowired
	LuggageInfoDao luggageInfoDao;

	public List<LuggageInfo> selectLuggageInfo(TripPlansCommonForm form) {
		List<LuggageInfo> resultList = new ArrayList<>();
		
		List<LuggageInfoEntity> luggageInfoEntityList = new ArrayList<>();
		String condition = "WHERE TRIP_PLAN_NAME = ? ";
		condition = condition + "AND UPD_DATE = (SELECT MAX(UPD_DATE) FROM T_LUGGAGE_INFO) ";
		
		try {
			luggageInfoEntityList = luggageInfoDao.selectLuggageInfoByPraimaryKey(condition, 
					new String[]{form.getTripPlanName(), null, null});
		} catch (SQLException e) {
			e.printStackTrace();
		}

		List<LuggageItemEntity> luggageItemEntityList = new ArrayList<>();
		if (ObjectUtils.isNotEmpty(luggageInfoEntityList)) {
			String[] luggageItemCondition = new String[] {"TRIP_PLAN_NAME", null, null, "INS_DATE"};
			SimpleDateFormat sdf = new SimpleDateFormat(CommonConstant.DATETIMEFORMAT_HYPHEN_COLON);
			try {
				luggageItemEntityList = luggageInfoDao.selectLuggageItemByPraimaryKey(luggageItemCondition, 
						new String[]{luggageInfoEntityList.get(0).getTripPlanName(), null, null,
								sdf.format(luggageInfoEntityList.get(0).getInsDate())});
			} catch (SQLException e) {
				e.printStackTrace();
			}			
		}
		
		this.setLuggageInfo(resultList, luggageInfoEntityList, luggageItemEntityList);
		
		return resultList;		
	}

	@Override
	public void insertLuggageInfo(TripPlansCommonForm form) {
		// DB登録
		try {
			luggageInfoDao.insert(form);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}
	
	public void deleteLuggageInfo(TripPlansCommonForm form) {
		String condition = null;
		String updDateParam = null;
				
		if (ObjectUtils.isNotEmpty(form.getSpotList()) &&
				ObjectUtils.isNotEmpty(form.getSpotList().get(0).getUpdDate())) {
			condition = "UPD_DATE <= ? ";
			updDateParam = form.getSpotList().get(0).getUpdDate();
		}
		try {
			luggageInfoDao.delete(form, condition, updDateParam);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	public void insertDeleteLuggageInfo(TripPlansCommonForm form) {
		if (ObjectUtils.isNotEmpty(form.getLuggageInfoList())) {
			this.insertLuggageInfo(form);			
		}
		this.deleteLuggageInfo(form);
	}
	
	
	private void setLuggageInfo(List<LuggageInfo> resultList, List<LuggageInfoEntity> luggageInfoEntityList, List<LuggageItemEntity> luggageItemEntityList) {
		SimpleDateFormat sdf = new SimpleDateFormat(CommonConstant.DATETIMEFORMAT_HYPHEN_COLON);
		
		// sort the luggageInfoEntity list and the LuggageItemEntity list by bagNo
		luggageInfoEntityList.sort((x, y) -> (x.getBagNo()).compareTo(y.getBagNo()));
		List<LuggageItemEntity> sortedLuggageItemEntityList = luggageItemEntityList.stream()
				.sorted((x, y) -> (x.getBagNo()).compareTo(y.getBagNo())).collect(Collectors.toList());
		
		for (LuggageInfoEntity lie : luggageInfoEntityList) {
			LuggageInfo li = new LuggageInfo();
			li.setTripPlanName(lie.getTripPlanName());
			li.setLuggageCount(lie.getLuggageCount());
			li.setBagNo(lie.getBagNo());
			li.setLuggagePrepaedFlg(lie.isLuggagePrepaedFlg());
			li.setInsUserId(lie.getInsUserId());
			li.setInsDate(sdf.format(lie.getInsDate()));
			li.setUpdUserId(lie.getUpdUserId());
			li.setUpdDate(sdf.format(lie.getUpdDate()));			

			List<LuggageItem> luggageItemList = new ArrayList<>();
			for (int i = 0; i < sortedLuggageItemEntityList.size(); i++) {
				LuggageItemEntity slime = sortedLuggageItemEntityList.get(i);
				if (StringUtils.equals(li.getBagNo(), slime.getBagNo())) {
					LuggageItem lim = new LuggageItem();
					lim.setTripPlanName(slime.getTripPlanName());
					lim.setItemNo(slime.getItemNo());
					lim.setBagNo(slime.getBagNo());
					lim.setItemNo(slime.getItemNo());
					lim.setItemName(slime.getItemName());
					lim.setItemCount(slime.getItemCount());
					lim.setItemPreparedFlg(slime.isItemPreparedFlg());
					lim.setItemOwnerName(slime.getItemOwnerName());
					lim.setInsUserId(lie.getInsUserId());
					lim.setInsDate(sdf.format(lie.getInsDate()));
					lim.setUpdUserId(lie.getUpdUserId());
					lim.setUpdDate(sdf.format(lie.getUpdDate()));	
					
					luggageItemList.add(lim);
					
					if (i == (sortedLuggageItemEntityList.size() - 1)) {
						li.setLuggageItemList(luggageItemList);
					}
				} else {
					if ((li.getBagNo()).compareTo(slime.getBagNo()) < 0) {
						li.setLuggageItemList(luggageItemList);
						break;						
					}
				}
			}
			resultList.add(li);
		}
	}	
}
