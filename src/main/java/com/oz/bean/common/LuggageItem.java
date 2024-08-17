package com.oz.bean.common;

import java.io.Serializable;
import java.util.Date;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
//import javax.validation.constraints.NotEmpty;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.constraints.Range;
import org.springframework.format.annotation.NumberFormat;

import com.oz.bean.common.LuggageInfo.ValidLuggageInfo;

public class LuggageItem implements Serializable {

	public static interface ValidLuggageItem{}

	private static final long serialVersionUID = 1L;

	/** trip plan name */
	private String tripPlanName;

	/** bag No */
	@NotEmpty(message="{errors.bagNo.empty}", groups={ValidLuggageItem.class})
	private String bagNo;

	/** item number */
	private int itemNo;

	/** item name */
	@NotEmpty(message="{errors.itemName.empty}", groups={ValidLuggageItem.class})
	@Size(min=1, max=1000, message="{errors.range.minMax}", groups={ValidLuggageItem.class})
	private String itemName;

	/** the number of item */
	@NotNull(message="{errors.itemCount.empty}", groups={ValidLuggageItem.class})
	@Range(min=1, max=1000, message="{errors.range.minMax}", groups={ValidLuggageItem.class})
	@Pattern(regexp = "[\\d+}", message = "{errors.format.itemCount.integer}")
	private Integer itemCount;

	/** item prepared flg */
	private boolean itemPreparedFlg;

	/** item owner */
	private String itemOwnerName;

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

	public String getBagNo() {
		return bagNo;
	}

	public void setBagNo(String bagNo) {
		this.bagNo = bagNo;
	}

	public int getItemNo() {
		return itemNo;
	}

	public void setItemNo(int itemNo) {
		this.itemNo = itemNo;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public Integer getItemCount() {
		return itemCount;
	}

	public void setItemCount(Integer itemCount) {
		this.itemCount = itemCount;
	}

	public boolean isItemPreparedFlg() {
		return itemPreparedFlg;
	}

	public void setItemPreparedFlg(boolean itemPreparedFlg) {
		this.itemPreparedFlg = itemPreparedFlg;
	}

	public String getItemOwnerName() {
		return itemOwnerName;
	}

	public void setItemOwnerName(String itemOwnerName) {
		this.itemOwnerName = itemOwnerName;
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
