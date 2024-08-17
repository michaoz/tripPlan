package com.oz.consts;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CommonConstant {
	
	private CommonConstant() {
	}
	
	/** tripPlanNameList */
	public static final String TRIP_PLAN_NAME_LIST = "tripPlanNameList";

	
	public static final List<String> LUGGAGE_KEYWORD_LIST = new ArrayList<>(
			Arrays.asList(
					"travel items"
					, "morning"
					, "afternoon"
					, "night"
					, "useful items"
					, "weather goods"
			)
	);
	
	public enum LUGGAGE_KEYWORD_ITEMS {
		Travel_Items("camera", "smartphone", "tent")
		, Morning("toothbrush", "hair brush", "face towel")
		, Afternoon("water bottle", "handkerchief")
		, Night("body towel", "glasses")
		, Useful_Items("sissors", "handy telescope", "watch")
		, Weather_Goods("umbrella")
		;
			
		private final String[] items;
		
		LUGGAGE_KEYWORD_ITEMS(String... items) {
			this.items = items;
		}
		
		public String[] getItems() {
			return this.items;
		}
	}
	
	// geometry type
	public static final String[] GEOMETRY_TYPES = {
			"POINT", "LINESTRING", "POLYGON", "POLYHEDRALSURFACE", "TRIANGLE", 
			"MULTIPOINT", "MULTILINESTRING", "MULTIPOLYGON", "TIN", "GEOMETRYCOLLECTION"
	};
	
	// bag No 
	public static final String[] BAG_NO_ARRY = {
			"01",
			"02",
			"03"
	};
	
	/** Date Format */
	public static final String DATEFORMAT_NO_PUNCTUATION = "yyyyMMdd";
	public static final String TIMEFORMAT_NO_PUNCTUATION = "HHmmssSSS";
	public static final String DATETIMEFORMAT_HYPHEN_COLON = "yyyy-MM-dd HH:mm:ss";
	public static final String DATETIMEFORMAT_HYPHEN_COLON_MILLIS = "yyyy-MM-dd HH:mm:ss.SSS";
	public static final String DATETIMEFORMAT_NO_PUNCTUATION = "yyyyMMdd HHmmssSSS";
	
	/** view */
	public static final String NEWPLAN_URL = "tripPlans/newPlan";
	public static final String CREATEROUTE_URL = "/tripPlans/createRoute";
	public static final String PREPLUGGAGE_URL = "/tripPlans/prepLuggage";
	public static final String CONFIRM_PLANS_URL = "/tripPlans/confirmPlans";
	public static final String RESULT_TRIP_PLANS_URL = "/tripPlans/resultTripPlans";

	public static final String REDIRECT_CREATEROUTE_URL = "/tripPlans/createRoute";
	public static final String REDIRECT_PREPLUGGAGE_URL = "/tripPlans/createRoute/prepLuggage";

	/** 正規表現 */
	// suffix
	public static final String PREFIX_MATCH = "^";
	// prefix
	public static final String SUFFIX_MATCH = "$";
	// 全角スペース、半角スペース
	public static final String REGEX_SPACE = "[\\h]+";
	// line break code （CR）
	public static final String REGEX_CR = "\r\n";
	// Tab
	public static final String REGEX_TAB = "\t";
	// Half-Width Space
	public static final String REGEX_HALF_SPACE = " ";
}
