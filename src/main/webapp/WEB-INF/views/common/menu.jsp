<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>


<div align="center" id = "menu">
	<c:if scope="session" test="${LOGIN_DATA != null}" var="login"/>
	<c:if test="${login}">
		<%-- ログイン時メニュー表示 --%>
		<ul class="menuList">
		    <li class="menuItem">
		    	<a href="/simu/u001UserList" class="menuLink">旅行計画</a>
		    </li>
		    <li class="menuItem">
		    	<a href="/simu/u001UserList"  class="menuLink">メニュー2</a>
		    </li>
		    <li class="menuItem">
		    	<a href="/simu/u001UserList" class="menuLink">メニュー3</a>
		    </li>
		    <li class="menuItem">
		    	<a href="/simu/u001UserList" class="menuLink">メニュー4</a>
		    </li>

		</ul>

	</c:if>
	<c:if test="${!login}">
		<%-- ログアウト時 --%>
		<ul class="menuList">&nbsp;</ul>
	</c:if>

</div>