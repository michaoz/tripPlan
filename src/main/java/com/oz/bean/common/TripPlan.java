package com.oz.bean.common;

import java.io.Serializable;
import java.util.Date;

public class TripPlan implements Serializable{
	
	/** シリアルID */
	private static final long serialVersionUID = 1L;

	/** trip plan name */
	private String tripPlanName;
		
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
