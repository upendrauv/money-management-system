package com.moneymanager.controller;

import com.moneymanager.dto.request.ExpenseRequest;
import com.moneymanager.dto.response.ApiResponse;
import com.moneymanager.dto.response.ExpenseDto;
import com.moneymanager.security.UserPrincipal;
import com.moneymanager.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseDto>>> getAllExpenses(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        List<ExpenseDto> expenses = expenseService.getExpenses(principal, month, year);
        return ResponseEntity.ok(ApiResponse.success(expenses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseDto>> getExpenseById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        ExpenseDto expense = expenseService.getExpenseById(id, principal);
        return ResponseEntity.ok(ApiResponse.success(expense));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseDto>> createExpense(
            @Valid @RequestBody ExpenseRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ExpenseDto created = expenseService.createExpense(request, principal);
        return new ResponseEntity<>(ApiResponse.success("Expense added successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseDto>> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ExpenseDto updated = expenseService.updateExpense(id, request, principal);
        return ResponseEntity.ok(ApiResponse.success("Expense updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        expenseService.deleteExpense(id, principal);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted successfully", null));
    }
}

