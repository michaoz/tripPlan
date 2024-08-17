DROP TABLE IF EXISTS T_LUGGAGE_ITEM
;
CREATE TABLE T_LUGGAGE_ITEM (
  TRIP_PLAN_NAME VARCHAR
  , BAG_NO CHAR(2)
  , ITEM_NO SMALLINT
  , ITEM_NAME VARCHAR
  , ITEM_COUNT SMALLINT
  , ITEM_PREPARED_FLG BOOLEAN
  , ITEM_OWNER_NAME CHAR
  ,  INS_USER_ID CHAR(8)
  ,  INS_DATE TIMESTAMP(0)
  ,  UPD_USER_ID CHAR(8)
  ,  UPD_DATE TIMESTAMP(0)
)
;
ALTER TABLE T_LUGGAGE_ITEM	
    ADD CONSTRAINT PK_T_LUGGAGE_ITEM PRIMARY KEY (TRIP_PLAN_NAME, BAG_NO, ITEM_NO, ITEM_NAME, INS_DATE)
;