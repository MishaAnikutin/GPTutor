package com.chatgpt.controllers;

import com.chatgpt.entity.PurchaseItem;
import com.chatgpt.services.PurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class PurchaseController {

    @Autowired
    PurchaseService purchaseService;

    @PostMapping(path = "/purchase/get_item")
    public PurchaseItem getItem(@RequestParam Map<String, String> allRequestParams) {

        for (String name: allRequestParams.keySet()) {
            String value = allRequestParams.get(name);
            System.out.println(name + " : " + value);
        }

        System.out.println(allRequestParams);
        purchaseService.isAccessSig(allRequestParams);

        return purchaseService.getItem(allRequestParams.get("item"));
    }

    @GetMapping(path = "/purchase/order_status_change")
    public String orderStatusChange(@RequestParam Map<String, String> allRequestParams) {

        for (String name: allRequestParams.keySet()) {
            String value = allRequestParams.get(name);
            System.out.println(name + " : " + value);
        }

        purchaseService.isAccessSig(allRequestParams);

        purchaseService.buyAttempts(
                allRequestParams.get("item"),
                allRequestParams.get("receiver_id"),
                allRequestParams.get("status")
        );

        return "";
    }
}
