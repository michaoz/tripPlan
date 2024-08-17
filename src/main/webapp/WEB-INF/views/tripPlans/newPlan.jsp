<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<%@ include file="../common/includes.jsp"%>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<link href="<c:url value='/resources/CSS/common.css' />" rel="stylesheet">
		<link href="<c:url value='/resources/CSS/trip-plans/newPlan.css' />" rel="stylesheet">
		
		<title>NewPlan</title>
		
	</head>
	<body>
	<form:form action="/tripPlan/travel/tripPlans/newPlan" method="POST" modelAttribute="tripPlansCommonForm">
		<jsp:include page = "../common/header.jsp"/>
		<div class="page-breadcrumb">
			<a  id="previous-page-name">Trip Planning</a>
			<span> > </span>
			<p id="current-page-name">Your Trip Plans-Make a New Plan</p>
		</div>		
		<div class="page-top-nav">
		  <div class="page-top-nav-links">
			  <div id="about"><p>About</p></div>
			  <div id="community"><p>Community</p></div>
			  <div id="blog"><p>Blog</p></div>
		  </div>
		</div>
		<div class="page-main-image">
			<!-- <img src="../../resources/images/planTrip.png"> --> 
		</div>
		<div class="body-make-new-plans">
			<div id="page-title">
				<p>Your Trip Plans /  <span>Make a New Plan</span></p>
			</div>
			<div id="new-plans-option-1">
				<%--<a href="/tripPlan/travel/tripPlans/createRoute">> Create a Route to the Destination</a>--%>
				<p onclick="toggleDisplayCreateRouteNav()">> Create a Route to the Destination</p>
				<p>Visit here to create a new route to your destinations.</p>
				
				<div class="create-route-nav" >
				  <div>
				    <form:radiobutton path="${newPlanFlg}" label="new plan" value="true" name="plan-kind" onchange="toggleDisplayPlanKindNav()" />
				    <form:radiobutton path="${newPlanFlg}" label="existing plan" value="false" name="plan-kind" onchange="toggleDisplayPlanKindNav()" />
				  </div>
				  <div>
				    <div class="new-plan-nav" >
				      Please input your new plan name below.<br>
				      new plan name: <br>
				      <form:input path="newTripPlanName" oninput="onInput()" />
				    </div>
				    <div class="existed-plan-nav" >
				      Please choose your existing plan name from the list.<br>
				      <form:select path="existedTripPlanName" multiple="false" >
				        <form:options items="${tripPlansCommonForm.tripPlanNameList}" />
				      </form:select>
				      <%--
				      <c:forEach items="${tripPlanNameList}" var="tripPlanName" varStatus="tripPlanNameStatus">
				        <c:out value="${tripPlanName}" />
				      </c:forEach>
				      --%>
				    </div>				    
				  </div>
				</div>
			</div>
			<div id="new-plans-option-2">
				<a href="">> Get Ideas</a>
				<p>Visit here to get ideas of your new trip from browsing great spots around the world.</p>
			</div>
		</div>
		
		<div class="page-control">
		  <button type="button" class="css-back-button" id="back-to-top-page" onclick="history.back()" >< Back to Previous Page</button>
		  <input type="button" class="css-submit-button" id="submit-createRoute" value="Go to the next page to create/edit a route. >" onclick="beforeSubmit('/tripPlan/travel/tripPlans/createRoute')">
		</div>
		
		<%-- hidden items --%>
		<form:hidden path="tripPlanNameList" />
			            
		</form:form>

		<jsp:include page = "../common/footer.jsp"/>
		<script type="text/javascript" src="../../resources/js/tripPlans/newPlan.js" defer></script>
	</body>
</html>
