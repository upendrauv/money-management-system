package com.moneymanager.service;

import com.moneymanager.dto.request.ExpenseRequest;
import com.moneymanager.dto.response.ExpenseDto;
import com.moneymanager.entity.Expense;
import com.moneymanager.entity.User;
import com.moneymanager.exception.ResourceNotFoundException;
import com.moneymanager.repository.ExpenseRepository;
import com.moneymanager.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final AuthService authService;

    public ExpenseService(ExpenseRepository expenseRepository, AuthService authService) {
        this.expenseRepository = expenseRepository;
        this.authService = authService;
    }

    @Transactional
    public ExpenseDto createExpense(ExpenseRequest request, UserPrincipal principal) {
        User user = authService.getUserEntity(principal);

        Expense expense = new Expense(
                request.getTitle().trim(),
                request.getAmount(),
                request.getCategory(),
                request.getDate(),
                request.getPaymentMethod(),
                request.getNotes(),
                user
        );

        Expense saved = expenseRepository.save(expense);
        return mapToDto(saved);
    }

    @Transactional
    public ExpenseDto updateExpense(Long id, ExpenseRequest request, UserPrincipal principal) {
        User user = authService.getUserEntity(principal);
        Expense expense = expenseRepository.findById(id)
                .filter(e -> e.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Expense entry not found with id: " + id));

        expense.setTitle(request.getTitle().trim());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setNotes(request.getNotes());

        Expense updated = expenseRepository.save(expense);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteExpense(Long id, UserPrincipal principal) {
        User user = authService.getUserEntity(principal);
        Expense expense = expenseRepository.findById(id)
                .filter(e -> e.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Expense entry not found with id: " + id));

        expenseRepository.delete(expense);
    }

    @Transactional(readOnly = true)
    public ExpenseDto getExpenseById(Long id, UserPrincipal principal) {
        User user = authService.getUserEntity(principal);
        Expense expense = expenseRepository.findById(id)
                .filter(e -> e.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Expense entry not found with id: " + id));

        return mapToDto(expense);
    }

    @Transactional(readOnly = true)
    public List<ExpenseDto> getExpenses(UserPrincipal principal, Integer month, Integer year) {
        User user = authService.getUserEntity(principal);

        List<Expense> expenses;
        if (month != null && year != null) {
            YearMonth ym = YearMonth.of(year, month);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();
            expenses = expenseRepository.findByUserAndDateBetweenOrderByDateDesc(user, start, end);
        } else {
            expenses = expenseRepository.findByUserOrderByDateDesc(user);
        }

        return expenses.stream().map(this::mapToDto).toList();
    }

    public ExpenseDto mapToDto(Expense expense) {
        return new ExpenseDto(
                expense.getId(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDate(),
                expense.getPaymentMethod(),
                expense.getNotes(),
                expense.getCreatedAt()
        );
    }
}

