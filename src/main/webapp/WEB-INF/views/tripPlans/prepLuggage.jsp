<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<%@ include file="../common/includes.jsp"%>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<!-- JQueryUI : to use Sortable function -->
		<script type="text/javascript" src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js"></script>
		<!-- JQueryUI : to use Sortable function end -->
		<link href="<c:url value='/resources/CSS/common.css' />" rel="stylesheet">
		<link href="<c:url value='/resources/CSS/trip-plans/prepLuggage.css' />" rel="stylesheet">
		<title>prep luggage</title>
	</head>
	<body>
	<jsp:include page = "../common/modalConfirmEmptyEnter.jsp"/>
	<jsp:include page = "../common/header.jsp"/>

	<form:form action="/tripPlan/travel/tripPlans/createRoute/prepLuggage/confirmPlans" method="POST" modelAttribute="tripPlansCommonForm">
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
<%-- 	<div class="page-main-image">
		</div>  --%>

		<%-- error messages area --%>
		<div class="css-error-message">
		  <c:forEach items="${tripPlansCommonForm.luggageInfoList}" var="luggageInfo" varStatus="luggageInfoStatus">
		    <form:errors path="luggageInfoList[${luggageInfoStatus.index}].luggageCount" />
		    <form:errors path="luggageInfoList[${luggageInfoStatus.index}].bagNo" />
		    <form:errors path="luggageInfoList[${luggageInfoStatus.index}].luggagePrepaedFlg" />
		    <form:errors path="luggageInfoList[${luggageInfoStatus.index}].insDate" />
		    <form:errors path="luggageInfoList[${luggageInfoStatus.index}].updDate" />
		    <c:forEach items="${tripPlansCommonForm.luggageInfoList}[${luggageInfoStatus.index}].${luggageItemList}" var="luggageItem" varStatus="luggageItemStatus">
  		      <form:errors path="luggageInfoList[${luggageInfoStatus.index}].luggageItemList[${luggageItemStatus.index}].itemNo" />
  		      <form:errors path="luggageInfoList[${luggageInfoStatus.index}].luggageItemList[${luggageItemStatus.index}].itemName" />
  		      <form:errors path="luggageInfoList[${luggageInfoStatus.index}].luggageItemList[${luggageItemStatus.index}].itemCount" />
  		      <form:errors path="luggageInfoList[${luggageInfoStatus.index}].luggageItemList[${luggageItemStatus.index}].itemPreparedFlg" />
  		      <form:errors path="luggageInfoList[${luggageInfoStatus.index}].luggageItemList[${luggageItemStatus.index}].itemOwnerName" />
  		      <form:errors path="luggageInfoList[${luggageInfoStatus.index}].luggageItemList[${luggageItemStatus.index}].insDate" />
  		      <form:errors path="luggageInfoList[${luggageInfoStatus.index}].luggageItemList[${luggageItemStatus.index}].updDate" />
		    </c:forEach>
		  </c:forEach>
		</div>

		<%-- DIV: body --%>
		<div class="body-prep-luggage">
		    <%-- DIV: The Luggage List --%>
			<div id="luggage-list-area">
			  <div id="page-title">
			    <p>The Luggage List</p>
			  </div>
			  <div class="css-luggage-keyword-list">
			      <c:forEach items="${luggageKeywordList}" var="luggageKeyword" varStatus="status">
  				    <div class="js-luggage-keyword_${status.index} css-luggage-keyword">
  				      <input type="checkbox" name="check" id="luggage-keyword-${status.index}" />
  				      <label for="luggage-keyword-${status.index}">${luggageKeyword}</label>
  				    </div>
				  </c:forEach>
			  </div>
			  <div class="js-luggage-keyword-items css-luggage-keyword-items">
				  <c:forEach items="${luggageKeywordList}" var="luggageKeyword" varStatus="status">
				    <c:forEach items="${luggageKeyword.getItems()}" var="item" varStatus="item_status">
				      <div id="item-${status.index}-${item_status.index}">
				        <input type="button" id="item-btn-${status.index}-${item_status.index}" />
				        <label for="item-btn-${status.index}-${item_status.index}"><c:out value="${item}" /></label>
				      </div>
				    </c:forEach>
				  </c:forEach>
			  </div>


			  <button type="button" class="js-add-record-btn css-add-recode-btn">add a record</button>
			  <button type="button" class="js-to-sort-luggage-list css-luggage-list-table-btn">sort Luggage List</button>

			  <div>

			  </div>

		      <table id="luggage-list-table">
		        <thead>
		          <tr id="header-table">
				    <th style="display: none"></th>
		            <th>No.</th>
		            <th>Bag No.</th>
		            <th style="display: none">ItemNo</th>
				    <th>Item Name</th>
				    <th>The Number of the Item</th>
				    <th>Delete Check</th>
		          </tr>
		        </thead>
		        <tbody>
		          <c:forEach items="${tripPlansCommonForm.luggageInfoList}" var="luggageInfo" varStatus="luggageInfoStatus">
		            <c:forEach items="${tripPlansCommonForm.luggageInfoList[luggageInfoStatus.index].luggageItemList}" var="luggageItem" varStatus="luggageItemStatus" end="${luggageInfoItemCountMap.get(luggageInfoStatus.index) - 1}">
			            <tr>
			              <td><span></span></td>
				          <td class="luggage-record-no" >
				            ${luggageInfoStatus.index + (luggageItemStatus.index + 1)}
				          </td>
				          <td class="luggage-bag-no" >
				            <form:select path="luggageInfoList[${luggageInfoStatus.index}].luggageItemList[${luggageItemStatus.index}].bagNo" multiple="false" >
				              <%--<form:option value="" /> --%>
				              <form:options items="${bagNoArry}" />
				            </form:select>
				          </td>
			              <td class="luggage-item-no" >
			                <form:hidden path="luggageInfoList[${luggageInfoStatus.index}].luggageItemList[${luggageItemStatus.index}].itemNo" value="${tripPlansCommonForm.luggageInfoList[luggageInfoStatus.index].luggageItemList[luggageItemStatus.index].itemNo}" />
				          </td>
			              <td class="luggage-item-name" >
				            <form:input path="luggageInfoList[${luggageInfoStatus.index}].luggageItemList[${luggageItemStatus.index}].itemName" />
				          </td>
			              <td class="luggage-item-count" >
				            <form:input path="luggageInfoList[${luggageInfoStatus.index}].luggageItemList[${luggageItemStatus.index}].itemCount" />
				          </td>
				          <td class="luggage-item-emit">
				            <input type="checkbox" id="luggage-item-count-emit-${luggageInfoStatus.index + (luggageItemStatus.index + 1)}" class="css-list-chbox">
				            <label for="luggage-item-count-emit-${luggageInfoStatus.index + (luggageItemStatus.index + 1)}" class="css-list-chbox-label">✓</label>
				          </td>
			            </tr>
				        <form:hidden path="luggageInfoList[${luggageInfoStatus.index}].bagNo" />
			            <form:hidden path="luggageInfoList[${luggageInfoStatus.index}].luggageItemList[${luggageItemStatus.index}].insDate" />
	  		            <form:hidden path="luggageInfoList[${luggageInfoStatus.index}].luggageItemList[${luggageItemStatus.index}].updDate" />
		            </c:forEach>
	                <form:hidden path="luggageInfoList[${luggageInfoStatus.index}].insDate" />
	                <form:hidden path="luggageInfoList[${luggageInfoStatus.index}].updDate" />
		          </c:forEach>
		        </tbody>
		      </table>
		    </div>
		</div>
		<div class="page-control">
		 <%--
		  <button type="button" value="Create a Route to the Destination" id="back-to-make-new-plans">
		      <a href="/tripPlan/travel/tripPlans/createRoute?back">Back to Create a Route to the Destination</a>
		  </button>
		  --%>
		 <%--
		  <button type="button" id="back-to-make-new-plans" onclick="history.back()">Back to Previous Page</button>

		  <input type="button" id="submit-back" class="css-back-button" value="Back to Previous Page" >
		  --%>
		  <input type="submit" id="submit-back" class="css-back-button" value="Back to Previous Page" >
		  <input type="submit" id="submit" class="css-submit-button" value="Save the Luggage List" >
		 <%--
		  <input type="button" id="submit-back" class="css-back-button" value="Back to Previous Page" >
		  <input type="button" id="submit" class="css-submit-button" value="Save the Luggage List" >
		  --%>
		</div>


		<%-- hidden items --%>
		<form:hidden path="tripPlanName" />
		<form:hidden path="newTripPlanName" />
		<form:hidden path="existedTripPlanName" />
		<form:hidden path="newPlanFlg" />
		<c:forEach items="${tripPlansCommonForm.spotList}" var="spotInfo" varStatus="spotInfoStatus">
		    <form:hidden path="spotList[${spotInfoStatus.index}].tripPlanName" />
		    <form:hidden path="spotList[${spotInfoStatus.index}].recordNum" />
		    <form:hidden path="spotList[${spotInfoStatus.index}].spotName" />
		    <form:hidden path="spotList[${spotInfoStatus.index}].city" />
		    <form:hidden path="spotList[${spotInfoStatus.index}].address" />
		    <form:hidden path="spotList[${spotInfoStatus.index}].latLon" />
		    <form:hidden path="spotList[${spotInfoStatus.index}].latitude" />
			<form:hidden path="spotList[${spotInfoStatus.index}].longitude" />
			<form:hidden path="spotList[${spotInfoStatus.index}].geoType" />
			<form:hidden path="spotList[${spotInfoStatus.index}].insUserId" />
			<form:hidden path="spotList[${spotInfoStatus.index}].insDate" />
			<form:hidden path="spotList[${spotInfoStatus.index}].updUserId" />
			<form:hidden path="spotList[${spotInfoStatus.index}].updDate" />
		</c:forEach>
	</form:form>

	<jsp:include page = "../common/footer.jsp"/>
    <!-- to import read external js file, change type of js to module -->
    <!-- <script type="text/javascript" src="../../../resources/js/tripPlans/prepLuggage.js" defer></script> -->
	<script type="module" src="../../../resources/js/tripPlans/prepLuggage.js" defer></script>
	</body>
</html>