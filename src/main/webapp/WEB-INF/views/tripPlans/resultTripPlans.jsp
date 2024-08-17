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
		<link href="<c:url value='/resources/CSS/trip-plans/resultTripPlans.css' />" rel="stylesheet">
		<title>prep luggage</title>
	</head>
	<body>
	<jsp:include page = "../common/header.jsp"/>

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
		
		<%-- DIV: body --%>
		<div class="body-prep-luggage">
		    <%-- DIV: The Luggage List --%>
			<div id="luggage-list-area">
			  <div id="result-message">
			    <p>
			        Your plan was created.
			        <br>
			        Please go back to the main page.
			        <br>
			        <br>		        
			    </p>
			  </div>
		  </div>
		</div>
		
		<%-- DIV: control the page --%>
		<div class="page-control">
		<button>
	        <a href="http://localhost:8080/tripPlan/travel/" >Back to Trip Planning</a>
		</button>
		</div>
						
	<jsp:include page = "../common/footer.jsp"/>
	<script type="text/javascript" src="../../../resources/js/tripPlans/confirmPlans.js" defer></script>
	</body>
</html>