DROP TABLE IF EXISTS T_ROUTE_INFO
;
CREATE TABLE T_ROUTE_INFO (		
  TRIP_PLAN_NAME VARCHAR			
  , RECORD_NUM INTEGER	
  , SPOT_NAME VARCHAR	
  , CITY CHAR(100)	
  , ADDRESS CHAR(150)
  , LATITUDE CHAR(30)	
  , LONGITUDE CHAR(30)	
  , LEAFLET_ID CHAR(20)	
  , GEO_TYPE CHAR(10)	
  , INS_USER_ID CHAR(8)	
  , INS_DATE TIMESTAMP(0)
  , UPD_USER_ID CHAR(8)	
  , UPD_DATE TIMESTAMP(0)	
)
;
ALTER TABLE T_ROUTE_INFO		
    ADD CONSTRAINT PK_T_ROUTE_INFO PRIMARY KEY (TRIP_PLAN_NAME, RECORD_NUM, LEAFLET_ID, GEO_TYPE, INS_DATE)
;