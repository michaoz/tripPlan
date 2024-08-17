package com.oz.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public final class LuggageInfoEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/** trip plan name */
	private String tripPlanName;
		
	/** the number of the luggage */
	private Integer luggageCount;
	
	/** bag No */
	private String bagNo;
	
	/** luggage prepared flg */
	private boolean luggagePrepaedFlg;
	
	/** ins user id */
	private String insUserId;
	
	/** ins date */
	private Date insDate;
	
	/** update user id */
	private String updUserId;
	
	/** update date */
	private Date updDate;

	
	

	public String getTripPlanName() {
		return tripPlanName;
	}

	public void setTripPlanName(String tripPlanName) {
		this.tripPlanName = tripPlanName;
	}
	
	public Integer getLuggageCount() {
		return luggageCount;
	}

	public void setLuggageCount(Integer luggageCount) {
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
	
	public String getInsUserId() {
		return insUserId;
	}

	public void setInsUserId(String insUserId) {
		this.insUserId = insUserId;
	}

	public Date getInsDate() {
		return insDate;
	}

	public void setInsDate(Date insDate) {
		this.insDate = insDate;
	}

	public String getUpdUserId() {
		return updUserId;
	}

	public void setUpdUserId(String updUserId) {
		this.updUserId = updUserId;
	}

	public Date getUpdDate() {
		return updDate;
	}

	public void setUpdDate(Date updDate) {
		this.updDate = updDate;
	}


}
