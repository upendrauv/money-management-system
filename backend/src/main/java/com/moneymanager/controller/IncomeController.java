package com.moneymanager.controller;

import com.moneymanager.dto.request.IncomeRequest;
import com.moneymanager.dto.response.ApiResponse;
import com.moneymanager.dto.response.IncomeDto;
import com.moneymanager.security.UserPrincipal;
import com.moneymanager.service.IncomeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<IncomeDto>>> getAllIncomes(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        List<IncomeDto> incomes = incomeService.getIncomes(principal, month, year);
        return ResponseEntity.ok(ApiResponse.success(incomes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<IncomeDto>> getIncomeById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        IncomeDto income = incomeService.getIncomeById(id, principal);
        return ResponseEntity.ok(ApiResponse.success(income));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<IncomeDto>> createIncome(
            @Valid @RequestBody IncomeRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        IncomeDto created = incomeService.createIncome(request, principal);
        return new ResponseEntity<>(ApiResponse.success("Income added successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<IncomeDto>> updateIncome(
            @PathVariable Long id,
            @Valid @RequestBody IncomeRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        IncomeDto updated = incomeService.updateIncome(id, request, principal);
        return ResponseEntity.ok(ApiResponse.success("Income updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteIncome(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        incomeService.deleteIncome(id, principal);
        return ResponseEntity.ok(ApiResponse.success("Income deleted successfully", null));
    }
}

