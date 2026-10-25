package com.moneymanager.controller;

import com.moneymanager.dto.request.BillRequest;
import com.moneymanager.dto.response.ApiResponse;
import com.moneymanager.dto.response.BillDto;
import com.moneymanager.entity.enums.BillStatus;
import com.moneymanager.security.UserPrincipal;
import com.moneymanager.service.BillService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BillDto>>> getAllBills(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) BillStatus status) {
        List<BillDto> bills = billService.getBills(principal, status);
        return ResponseEntity.ok(ApiResponse.success(bills));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BillDto>> getBillById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        BillDto bill = billService.getBillById(id, principal);
        return ResponseEntity.ok(ApiResponse.success(bill));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BillDto>> createBill(
            @Valid @RequestBody BillRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        BillDto created = billService.createBill(request, principal);
        return new ResponseEntity<>(ApiResponse.success("Bill created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BillDto>> updateBill(
            @PathVariable Long id,
            @Valid @RequestBody BillRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        BillDto updated = billService.updateBill(id, request, principal);
        return ResponseEntity.ok(ApiResponse.success("Bill updated successfully", updated));
    }

    @PatchMapping("/{id}/pay")
    public ResponseEntity<ApiResponse<BillDto>> markAsPaid(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate paidDate,
            @AuthenticationPrincipal UserPrincipal principal) {
        BillDto updated = billService.markAsPaid(id, paidDate, principal);
        return ResponseEntity.ok(ApiResponse.success("Bill marked as paid", updated));
    }

    @PatchMapping("/{id}/pending")
    public ResponseEntity<ApiResponse<BillDto>> markAsPending(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        BillDto updated = billService.markAsPending(id, principal);
        return ResponseEntity.ok(ApiResponse.success("Bill marked as pending", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBill(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        billService.deleteBill(id, principal);
        return ResponseEntity.ok(ApiResponse.success("Bill deleted successfully", null));
    }
}

