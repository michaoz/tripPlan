<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div id = "header">
	<div id = "logo">
		<a href = "/tripPlan" class="logoLink">Trip Planning</a>
	</div>
	<div id = "login">
	<c:if test="${LOGIN_DATA == null}" var="login"/>
	<c:if test="${login}">

		<a href = "/tripPlan/controller/Login" >Login</a>

	</c:if>
	<c:if test="${!login}">

		<a href = "/tripPlan/controller/Logout" >Logout</a>

	</c:if>
	</div>
</div>
<%-- <jsp:include page = "./menu.jsp"/> --%>