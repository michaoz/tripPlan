<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<html>
	<link href="<c:url value='/resources/CSS/common.css' />" rel="stylesheet">
	<link href="<c:url value='/resources/CSS/modal.css' />" rel="stylesheet">

	<div class="modal" id="js-modal-confirm-empty-enter">
	  <div id="div-modal-message">
	    You have not input any information in the form.
	    <br>
	    Are you sure you'd like to go to the next page?
	  </div>
	  <div class="css-modal-btns" id="js-modal-confirm-empty-enter-btns">
	    <button type="button" value="0" >Yes</button>
	    <button type="button"  value="1" >No</button>
	    <input type="hidden" id="confirm-empty-enter-val" value="" />
	  </div>
	</div>
</html>