<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<%@ include file="../common/includes.jsp"%>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>		
		<!-- JQueryUI : to use Sortable function -->
		<script type="text/javascript" src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js"></script>
		<!-- JQueryUI : to use Sortable function end -->
		<link href="<c:url value='/resources/CSS/common.css' />" rel="stylesheet">
		<link href="<c:url value='/resources/CSS/trip-plans/createRoute.css' />" rel="stylesheet">

		<!-- OpenStreetMapを使用するためのLeafletライブラリ  --> 
		<!-- Leaflet libraries to use OpenStreetMap --> 
		<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.2/dist/leaflet.css"
	     integrity="sha256-sA+zWATbFveLLNqWO2gtiw3HL/lh1giY/Inf1BJ0z14="
	     crossorigin=""/>
     	<!-- put this AFTER Leaflet's CSS -->
     	<!-- <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"
        integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=="
        crossorigin=""></script> -->
        <script src="https://unpkg.com/leaflet@1.9.2/dist/leaflet.js"
	     integrity="sha256-o9N1jGDZrf5tS+Ft4gbIK7mYMipq9lqpVJ91xHSyKhg="
	     crossorigin=""></script>
		<!-- Leaflet libraries to use OpenStreetMap end --> 
		<!-- OpenStreetMapを使用するためのLeafletライブラリend  --> 
				
		<!--<script type="text/javascript" src="../../resources/js/tripPlans/map.js" ></script>-->
		
		<title>create route</title>
	</head>
	<body>
	<jsp:include page = "../common/modalConfirmEmptyEnter.jsp"/>	
	<jsp:include page = "../common/header.jsp"/>
	<form:form action="/tripPlan/travel/tripPlans/createRoute/prepLuggage" method="POST" modelAttribute="tripPlansCommonForm">
	
		<div class="page-breadcrumb">
			<a  id="previous-page-name">Trip Planning</a>
			<span> > </span>
			<a  id="previous-page-name">Make a New Plan</a>
			<span> > </span>
			<p id="current-page-name">Create a Route to the Destination</p>
		</div>		
		<div class="page-top-nav">
		  <div class="page-top-nav-links">
			  <div id="about"><p>About</p></div>
			  <div id="community"><p>Community</p></div>
			  <div id="blog"><p>Blog</p></div>
		  </div>
		</div>
		<div class="page-main-image">
			<c:set var="reloadCnt" value="1"/>
			<c:out value="<br>reloadCnt: ${reloadCnt}<br>" />
			<%-- TODO <c:if test="${empty initDisplayFlg or initDisplayFlg == 0}">  --%> 
			<c:if test="${empty reloadCnt or reloadCnt == 0}">
			  <div id="worldMap">
			    <img src="../../resources/images/WorldMap02.png">
			  </div>
			</c:if>
			<%-- TODO <c:if test="${initDisplayFlg > 0}">  --%>
			<div id="mapContainer"></div>
  			<%-- <form:input path="initDisplayFlg" value="${reloadCnt}" />  --%> 
			<div class="search-box">
	           <div class="form-field">
	               <input type="search" name="search" placeholder="Search..." id="content-to-search" value="">
	               <input type="button" value="Search" id="search-button">
	           </div>
		     </div>
		</div>
		
		<%-- DIV: Map Result --%>
		<div class="map-search-results">
		  <div>
	      <table id="search-result-header-table">
	        <thead>
	          <tr>
      		    <th>Search Results</th>
	          </tr>
	        </thead>
	      </table>
	      <table id="search-result-table">
	        <thead>
	          <tr id="header-table">
	            <th>No</th>
			    <th>Address</th>
			    <th style="display: none">LatLon</th>
			    <th>Add to list</th>
	          </tr>
	        </thead>
	      </table>
	      </div>
		</div>
		
		<button type="button" class="js-confirm css-confirm-btn" value="confirm the created route">
		  <p>confirm the created route</p>
		</button>
		
		<%-- error messages area --%>
		<div class="css-error-message">
		  <c:forEach items="${tripPlansCommonForm.spotList}" var="spotInfo" varStatus="spotInfoStatus">
		    <form:errors path="spotList[${spotInfoStatus.index}].recordNum" />
		    <form:errors path="spotList[${spotInfoStatus.index}].spotName" />	
		    <form:errors path="spotList[${spotInfoStatus.index}].city" />
		    <form:errors path="spotList[${spotInfoStatus.index}].address" />
  		    <form:errors path="spotList[${spotInfoStatus.index}].latLon" />
		    <form:errors path="spotList[${spotInfoStatus.index}].leafletId" />
		    <form:errors path="spotList[${spotInfoStatus.index}].geoType" />
		    <form:errors path="spotList[${spotInfoStatus.index}].insDate" />
		    <form:errors path="spotList[${spotInfoStatus.index}].updDate" />
		  </c:forEach>
		</div>		
		
		<%-- DIV: Spot List, Delete List --%>
		<div class="body-make-new-plans">
			<div id="spot-list-area">
			  <div id="page-title">
			    <p>Spot List</p>
			  </div>
			  <div class="css-spot-list-nav">
				  <div class="js-draw-route css-draw-route"><input type="checkbox" name="check"></div>
				  <button type="button" class="js-to-delete-list css-add-recode-button">send to Delete List</button>
				  <button type="button" class="js-to-sort-spot-list css-spot-list-table-btn">sort Spot List</button>
			  </div>
			  
			  <%-- remained for studying --%>
    	      <%-- <c:set var="spotListRecordNo" value="0"/> --%>
		      <%-- <span id="span-spotListRecordNo"><c:out value="${spotListRecordNo}" /></span> --%>
			  <%-- remained for studying end --%>
		      <table id="spot-list-table">
		        <thead>
		          <tr id="header-table">
				    <th style="display: none"></th>
				    <th>Emit</th>
		            <th>No</th>
				    <th>Spot Name</th>
				    <th>City</th>
				    <th>Address</th>
		          </tr>
		        </thead>
		        <tbody>
		        <c:forEach items="${tripPlansCommonForm.spotList}" var="spotInfo" varStatus="spotInfoStatus">
			        <tr id="${tripPlansCommonForm.spotList[spotInfoStatus.index].recordNum}">
			          <td><span></span></td>
			          <td>
			            <input type="checkbox" id="spot-list-record-content-emit-${tripPlansCommonForm.spotList[spotInfoStatus.index].recordNum}:${tripPlansCommonForm.spotList[spotInfoStatus.index].leafletId.split(':')[1]}" 
			            class="css-list-chbox" value="${tripPlansCommonForm.spotList[spotInfoStatus.index].recordNum}:${tripPlansCommonForm.spotList[spotInfoStatus.index].leafletId.split(':')[1]}">
			            <label for="spot-list-record-content-emit-${tripPlansCommonForm.spotList[spotInfoStatus.index].recordNum}:${tripPlansCommonForm.spotList[spotInfoStatus.index].leafletId.split(':')[1]}" 
			            class="css-list-chbox-label">✓</label></td>
			          <td id="spot-list-record-no-${tripPlansCommonForm.spotList[spotInfoStatus.index].recordNum}:${tripPlansCommonForm.spotList[spotInfoStatus.index].leafletId.split(':')[1]}" >
			            <form:hidden path="spotList[${spotInfoStatus.index}].recordNum" />
			            ${tripPlansCommonForm.spotList[spotInfoStatus.index].recordNum}
			          </td>
			          <td id="spot-list-record-content-spotName-${tripPlansCommonForm.spotList[spotInfoStatus.index].recordNum}:${tripPlansCommonForm.spotList[spotInfoStatus.index].leafletId.split(':')[1]}">
			            <form:hidden path="spotList[${spotInfoStatus.index}].spotName" />
			            ${tripPlansCommonForm.spotList[spotInfoStatus.index].spotName}
			          </td>
			          <td id="spot-list-record-content-city-${tripPlansCommonForm.spotList[spotInfoStatus.index].recordNum}:${tripPlansCommonForm.spotList[spotInfoStatus.index].leafletId.split(':')[1]}">
			            <form:hidden path="spotList[${spotInfoStatus.index}].city" />
			            ${tripPlansCommonForm.spotList[spotInfoStatus.index].city}
			          </td>
			          <td id="spot-list-record-content-address-${tripPlansCommonForm.spotList[spotInfoStatus.index].recordNum}:${tripPlansCommonForm.spotList[spotInfoStatus.index].leafletId.split(':')[1]}">
			            <form:hidden path="spotList[${spotInfoStatus.index}].address" />
			            ${tripPlansCommonForm.spotList[spotInfoStatus.index].address}
			          </td>
			          <td style="display: none" id="spot-list-record-content-latLon-${tripPlansCommonForm.spotList[spotInfoStatus.index].recordNum}:${tripPlansCommonForm.spotList[spotInfoStatus.index].leafletId.split(':')[1]}">
			            <form:hidden path="spotList[${spotInfoStatus.index}].latLon" />
			            ${tripPlansCommonForm.spotList[spotInfoStatus.index].latLon}
			          </td>
			          <td style="display: none" id="spot-list-record-content-leafletId">
			            <form:hidden path="spotList[${spotInfoStatus.index}].leafletId" />
			            ${tripPlansCommonForm.spotList[spotInfoStatus.index].leafletId}
			          </td>
			          <td style="display: none">
    			      <form:hidden path="spotList[${spotInfoStatus.index}].latitude" />
			          <form:hidden path="spotList[${spotInfoStatus.index}].longitude" />
			          <form:hidden path="spotList[${spotInfoStatus.index}].geoType" />
			          <form:hidden path="spotList[${spotInfoStatus.index}].insUserId" />
			          <form:hidden path="spotList[${spotInfoStatus.index}].insDate" />
			          <form:hidden path="spotList[${spotInfoStatus.index}].updUserId" />
			          <form:hidden path="spotList[${spotInfoStatus.index}].updDate" />
			          </td>
			        </tr>
		        </c:forEach>
		        </tbody>
		      </table>
		    </div>
			<div id="delete-list-area">
			  <div id="page-title">
			    <p>Delete List</p>
			  </div>
			  <button type="button" class="js-back-to-recode css-back-to-recode-button">back to recode</button>
			  <table id="delete-list-table">
		        <thead>
		          <tr id="header-table">
				    <th>Add</th>
		            <th>No</th>
				    <th>Spot Name</th>
		          </tr>
		        </thead>
		      </table>
		    </div>
		</div>
		
		<%-- DIV: confirm pane --%>
			<div class="body-created-route">
				<div id="page-title">
				  <p>The Created Route</p>
				</div>
			    <table id="created-route-table">
			        <thead>
			            <tr>
     				      <th></th>
				          <th>Emit</th>
		   	              <th>No</th>
					      <th>Spot Name</th>
					      <th>City</th>
					      <th>Address</th>
			            </tr>
			        </thead>
			    </table>
			</div>
		
			<%-- DIV: control the page --%>
			<div class="page-control">
			  <button type="button" id="back-to-make-new-plans" class="css-back-button" value="< Back">
			      <a href="/tripPlan/travel/tripPlans/newPlan">< Back to Make a New Plan</a>
			  </button>
			  <%-- Enterキーでの次画面遷移防止のため、type="submit"は不使用とする --%>
			  <%--<input type="submit" name="save" id="save" class="css-submit-button" value="Save >">--%>
			  <input type="button" name="save" id="save" class="css-submit-button" value="Save >">
			</div>
			
			<%-- hidden items --%>
			<form:hidden path="tripPlanName" />
			<form:hidden path="newTripPlanName" />
			<form:hidden path="existedTripPlanName" />
			<form:hidden path="newPlanFlg" />
			<form:hidden path="tripPlanNameList" />

	</form:form>

	<jsp:include page = "../common/footer.jsp"/>
    <!-- reading external js file -->
	<script type="module" src="../../resources/js/tripPlans/createRoute.js" defer></script>
	</body>
</html>