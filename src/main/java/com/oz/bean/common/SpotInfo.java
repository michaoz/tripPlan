package com.oz.bean.common;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

public class SpotInfo implements Serializable{

	public static interface ValidSpotInfo{}

	/** シリアルID */
	private static final long serialVersionUID = 1L;

	/** trip plan name */
	private String tripPlanName;

	/** record number */
	private int recordNum;

	/** spot name */
	@NotEmpty(message="{errors.spotName.empty}")
	private String spotName;

	/** city */
//	@NotNull(message="{errors.empty}")
	@NotEmpty(message="{errors.city.empty}")
	private String city;

	/** address */
	@NotEmpty(message="{errors.address.empty}", groups={ValidSpotInfo.class})
	private String address;

	/** geo info */

	/** latitude and longitude */
	@NotEmpty(message="{errors.latLon.empty}")
	@Pattern(regexp="(^\\d$)", message="{errors.format.latLon.integer}")
	private String latLon;

	/** latitude */
	private String latitude;

	/** longitude */
	private String longitude;

	/** leafletId */
	@NotEmpty(message="{errors.leafletId.empty}")
	@Pattern(regexp="(^\\d$)", message="{errors.format.leafletId.integer}")
	private String leafletId;

	/** geometry type */
	private String geoType;

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

	public int getRecordNum() {
		return recordNum;
	}

	public void setRecordNum(int recordNum) {
		this.recordNum = recordNum;
	}

	public String getSpotName() {
		return spotName;
	}

	public void setSpotName(String spotName) {
		this.spotName = spotName;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getLatLon() {
		return latLon;
	}

	public void setLatLon(String latLon) {
		this.latLon = latLon;
	}

	public String getLatitude() {
		return latitude;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	public String getLongitude() {
		return longitude;
	}

	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

	public String getLeafletId() {
		return leafletId;
	}

	public void setLeafletId(String leafletId) {
		this.leafletId = leafletId;
	}

	public String getGeoType() {
		return geoType;
	}

	public void setGeoType(String geoType) {
		this.geoType = geoType;
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
