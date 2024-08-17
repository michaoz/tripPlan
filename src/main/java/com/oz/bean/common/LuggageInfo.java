package com.oz.bean.common;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

import com.oz.bean.common.LuggageInfo.ValidLuggageInfo;
import com.oz.bean.common.LuggageItem.ValidLuggageItem;

public final class LuggageInfo implements Serializable {

	public static interface ValidLuggageInfo{}

	private static final long serialVersionUID = 1L;

	/** trip plan name */
	private String tripPlanName;

	/** the number of the luggage */
	private int luggageCount;

	/** bag No */
	private String bagNo;

	/** luggage prepared flg */
	private boolean luggagePrepaedFlg;

	/** luggage item list */
	@Valid
	private List<LuggageItem> luggageItemList;

	/** ins user id */
	private String insUserId;

	/** ins date */
	private String insDate;

	/** update user id */
	private String updUserId;

	/** update date */
	private String updDate;



	public String getTripPlanName() {
		return tripPlanName;
	}

	public void setTripPlanName(String tripPlanName) {
		this.tripPlanName = tripPlanName;
	}

	public int getLuggageCount() {
		return luggageCount;
	}

	public void setLuggageCount(int luggageCount) {
		this.luggageCount = luggageCount;
	}

	public String getBagNo() {
		return bagNo;
	}

	public void setBagNo(String bagNo) {
		this.bagNo = bagNo;
	}

	public boolean isLuggagePrepaedFlg() {
		return luggagePrepaedFlg;
	}

	public void setLuggagePrepaedFlg(boolean luggagePrepaedFlg) {
		this.luggagePrepaedFlg = luggagePrepaedFlg;
	}

	public List<LuggageItem> getLuggageItemList() {
		return luggageItemList;
	}

	public void setLuggageItemList(List<LuggageItem> luggageItemList) {
		this.luggageItemList = luggageItemList;
	}

	public String getInsUserId() {
		return insUserId;
	}

	public void setInsUserId(String insUserId) {
		this.insUserId = insUserId;
	}

	public String getInsDate() {
		return insDate;
	}

	public void setInsDate(String insDate) {
		this.insDate = insDate;
	}

	public String getUpdUserId() {
		return updUserId;
	}

	public void setUpdUserId(String updUserId) {
		this.updUserId = updUserId;
	}

	public String getUpdDate() {
		return updDate;
	}

	public void setUpdDate(String updDate) {
		this.updDate = updDate;
	}


}
