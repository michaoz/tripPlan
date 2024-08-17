package com.oz.controller;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.oz.bean.common.TripPlansCommonForm;
import com.oz.consts.CommonConstant;
import com.oz.service.TripPlanService;

@Controller
@RequestMapping(value="travel")
public class TopController {
	
	@Autowired
	TripPlanService tripPlanService;
	
    @RequestMapping(value = "/", method = GET)
    public String showTop() {
        return "top";
    }
    
    @RequestMapping(value = "/destinationsList", method = GET)
    public String showDestinationsList() {
        return "destinations/destinations";
    }
    
    @RequestMapping(value = "/tripPlans/newPlan", method = GET)
    public String showNewPlan(@ModelAttribute("tripPlansCommonForm") TripPlansCommonForm form, HttpServletRequest req, HttpServletResponse res, HttpSession session) {
    	List<String> tripPlanNameList = tripPlanService.getTripPlanNameList();
    	//req.setAttribute(CommonConstant.TRIP_PLAN_NAME_LIST, tripPlanNameList);
    	form.setTripPlanNameList(tripPlanNameList);
    	
		return CommonConstant.NEWPLAN_URL;
    }
    
    @RequestMapping(value = "/tripPlans/createdPlans", method = GET)
    public String showCreatedPlans() {
        return "tripPlans/createdPlans";
    }
}