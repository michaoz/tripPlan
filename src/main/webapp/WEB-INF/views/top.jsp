<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<%@ include file="./common/includes.jsp"%>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<link href="<c:url value='/resources/CSS/common.css' />" rel="stylesheet">
		<link href="<c:url value='/resources/CSS/top.css' />" rel="stylesheet">
		<script type="text/javascript" src="../resources/js/top.js" ></script>
		<title>Top</title>
	</head>
	<body>
		<jsp:include page = "./common/header.jsp"/>

		<div class="page-main-div">
			<div id = "trip-planning-div">
				<div id="trip-planning-options-div">
				    <div class="your-trip-plans-div">
						<p>Your Trip Plans</p>
					</div>
					<div id="your-trip-plans-list-nav-div">
						<nav id="your-trip-plans-list-nav">
							<ul>
								<li><a href="/tripPlan/travel/tripPlans/newPlan">Make a New Plan</a></li>
								<li><a href="/tripPlan/travel/tripPlans/createdPlans">See Created Plans</a></li>
							</ul>
						</nav>
					</div>
				</div>
				<div id="trip-planning-options-div">
				    <div class="destinations-list-div"> 
						<a href="/tripPlan/travel/destinationsList">Destinations List</a>
					</div>
				</div>
				<div class="page-p">
				    <p>Discover New World</p>
				</div>
			</div>
		</div>
		<script src="js/test.js"></script>
		<jsp:include page = "./common/footer.jsp"/>
	</body>
</html>