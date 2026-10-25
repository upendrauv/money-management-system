package com.moneymanager.controller;

import com.moneymanager.dto.request.BudgetRequest;
import com.moneymanager.dto.response.ApiResponse;
import com.moneymanager.dto.response.BudgetDto;
import com.moneymanager.security.UserPrincipal;
import com.moneymanager.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetDto>>> getBudgets(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        List<BudgetDto> budgets = budgetService.getBudgets(principal, month, year);
        return ResponseEntity.ok(ApiResponse.success(budgets));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BudgetDto>> setBudget(
            @Valid @RequestBody BudgetRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        BudgetDto budget = budgetService.setBudget(request, principal);
        return new ResponseEntity<>(ApiResponse.success("Budget saved successfully", budget), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        budgetService.deleteBudget(id, principal);
        return ResponseEntity.ok(ApiResponse.success("Budget deleted successfully", null));
    }
}

