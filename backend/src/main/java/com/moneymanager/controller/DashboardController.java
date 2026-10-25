package com.moneymanager.controller;

import com.moneymanager.dto.response.ApiResponse;
import com.moneymanager.dto.response.DashboardSummaryDto;
import com.moneymanager.security.UserPrincipal;
import com.moneymanager.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getSummary(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        DashboardSummaryDto summary = dashboardService.getDashboardSummary(principal, month, year);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}

