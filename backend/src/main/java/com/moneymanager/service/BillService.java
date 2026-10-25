package com.moneymanager.service;

import com.moneymanager.dto.request.BillRequest;
import com.moneymanager.dto.response.BillDto;
import com.moneymanager.entity.Bill;
import com.moneymanager.entity.User;
import com.moneymanager.entity.enums.BillStatus;
import com.moneymanager.exception.ResourceNotFoundException;
import com.moneymanager.repository.BillRepository;
import com.moneymanager.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final AuthService authService;

    public BillService(BillRepository billRepository, AuthService authService) {
        this.billRepository = billRepository;
        this.authService = authService;
    }

    @Transactional
    public BillDto createBill(BillRequest request, UserPrincipal principal) {
        User user = authService.getUserEntity(principal);

        Bill bill = new Bill(
                request.getTitle().trim(),
                request.getAmount(),
                request.getCategory(),
                request.getDueDate(),
                request.getStatus(),
                request.getFrequency(),
                request.getIsRecurring(),
                request.getReminderDaysBefore(),
                request.getNotes(),
                user
        );

        if (bill.getStatus() != BillStatus.PAID && bill.getDueDate().isBefore(LocalDate.now())) {
            bill.setStatus(BillStatus.OVERDUE);
        }

        Bill saved = billRepository.save(bill);
        return mapToDto(saved);
    }

    @Transactional
    public BillDto updateBill(Long id, BillRequest request, UserPrincipal principal) {
        User user = authService.getUserEntity(principal);
        Bill bill = billRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));

        bill.setTitle(request.getTitle().trim());
        bill.setAmount(request.getAmount());
        bill.setCategory(request.getCategory());
        bill.setDueDate(request.getDueDate());
        bill.setFrequency(request.getFrequency());
        bill.setIsRecurring(request.getIsRecurring());
        bill.setReminderDaysBefore(request.getReminderDaysBefore());
        bill.setNotes(request.getNotes());

        if (request.getStatus() != null) {
            bill.setStatus(request.getStatus());
        }

        if (bill.getStatus() != BillStatus.PAID && bill.getDueDate().isBefore(LocalDate.now())) {
            bill.setStatus(BillStatus.OVERDUE);
        }

        Bill updated = billRepository.save(bill);
        return mapToDto(updated);
    }

    @Transactional
    public BillDto markAsPaid(Long id, LocalDate paidDate, UserPrincipal principal) {
        User user = authService.getUserEntity(principal);
        Bill bill = billRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));

        bill.setStatus(BillStatus.PAID);
        bill.setPaidDate(paidDate != null ? paidDate : LocalDate.now());

        Bill updated = billRepository.save(bill);
        return mapToDto(updated);
    }

    @Transactional
    public BillDto markAsPending(Long id, UserPrincipal principal) {
        User user = authService.getUserEntity(principal);
        Bill bill = billRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));

        bill.setPaidDate(null);
        if (bill.getDueDate().isBefore(LocalDate.now())) {
            bill.setStatus(BillStatus.OVERDUE);
        } else {
            bill.setStatus(BillStatus.PENDING);
        }

        Bill updated = billRepository.save(bill);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteBill(Long id, UserPrincipal principal) {
        User user = authService.getUserEntity(principal);
        Bill bill = billRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));

        billRepository.delete(bill);
    }

    @Transactional(readOnly = true)
    public BillDto getBillById(Long id, UserPrincipal principal) {
        User user = authService.getUserEntity(principal);
        Bill bill = billRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));

        return mapToDto(bill);
    }

    @Transactional
    public List<BillDto> getBills(UserPrincipal principal, BillStatus status) {
        User user = authService.getUserEntity(principal);

        List<Bill> bills;
        if (status != null) {
            bills = billRepository.findByUserAndStatusOrderByDueDateAsc(user, status);
        } else {
            bills = billRepository.findByUserOrderByDueDateAsc(user);
        }

        LocalDate today = LocalDate.now();
        // Check and update overdue status dynamically
        for (Bill bill : bills) {
            if (bill.getStatus() == BillStatus.PENDING && bill.getDueDate().isBefore(today)) {
                bill.setStatus(BillStatus.OVERDUE);
                billRepository.save(bill);
            }
        }

        return bills.stream().map(this::mapToDto).toList();
    }

    public BillDto mapToDto(Bill bill) {
        LocalDate today = LocalDate.now();
        boolean isOverdue = bill.getStatus() != BillStatus.PAID && bill.getDueDate().isBefore(today);
        long daysRemaining = ChronoUnit.DAYS.between(today, bill.getDueDate());

        return new BillDto(
                bill.getId(),
                bill.getTitle(),
                bill.getAmount(),
                bill.getCategory(),
                bill.getDueDate(),
                bill.getStatus(),
                bill.getFrequency(),
                bill.getIsRecurring(),
                bill.getPaidDate(),
                bill.getReminderDaysBefore(),
                bill.getNotes(),
                isOverdue,
                daysRemaining,
                bill.getCreatedAt()
        );
    }
}

