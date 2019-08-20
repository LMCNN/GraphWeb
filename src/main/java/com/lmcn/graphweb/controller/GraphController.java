package com.lmcn.graphweb.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class GraphController {

    @ResponseBody
    @RequestMapping("/test")
    public String test(){
        return "Test method";
    }
}
