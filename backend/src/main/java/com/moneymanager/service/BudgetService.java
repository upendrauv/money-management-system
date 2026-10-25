package com.moneymanager.service;

import com.moneymanager.dto.request.BudgetRequest;
import com.moneymanager.dto.response.BudgetDto;
import com.moneymanager.entity.Budget;
import com.moneymanager.entity.User;
import com.moneymanager.exception.ResourceNotFoundException;
import com.moneymanager.repository.BudgetRepository;
import com.moneymanager.repository.ExpenseRepository;
import com.moneymanager.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final AuthService authService;

    public BudgetService(BudgetRepository budgetRepository,
                         ExpenseRepository expenseRepository,
                         AuthService authService) {
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
        this.authService = authService;
    }

    @Transactional
    public BudgetDto setBudget(BudgetRequest request, UserPrincipal principal) {
        User user = authService.getUserEntity(principal);

        Optional<Budget> existing = budgetRepository.findByUserAndCategoryAndMonthAndYear(
                user, request.getCategory(), request.getMonth(), request.getYear()
        );

        Budget budget;
        if (existing.isPresent()) {
            budget = existing.get();
            budget.setAllocatedAmount(request.getAllocatedAmount());
        } else {
            budget = new Budget(
                    request.getCategory(),
                    request.getAllocatedAmount(),
                    request.getMonth(),
                    request.getYear(),
                    user
            );
        }

        Budget saved = budgetRepository.save(budget);
        return mapToDto(saved, user);
    }

    @Transactional
    public void deleteBudget(Long id, UserPrincipal principal) {
        User user = authService.getUserEntity(principal);
        Budget budget = budgetRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        budgetRepository.delete(budget);
    }

    @Transactional(readOnly = true)
    public List<BudgetDto> getBudgets(UserPrincipal principal, Integer month, Integer year) {
        User user = authService.getUserEntity(principal);

        int targetMonth = month != null ? month : LocalDate.now().getMonthValue();
        int targetYear = year != null ? year : LocalDate.now().getYear();

        List<Budget> budgets = budgetRepository.findByUserAndMonthAndYear(user, targetMonth, targetYear);
        return budgets.stream().map(b -> mapToDto(b, user)).toList();
    }

    public BudgetDto mapToDto(Budget budget, User user) {
        YearMonth ym = YearMonth.of(budget.getYear(), budget.getMonth());
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        BigDecimal spent = expenseRepository.sumByUserAndCategoryAndDateBetween(user, budget.getCategory(), start, end);
        if (spent == null) {
            spent = BigDecimal.ZERO;
        }

        BigDecimal remaining = budget.getAllocatedAmount().subtract(spent);
        double percentage = 0.0;
        if (budget.getAllocatedAmount().compareTo(BigDecimal.ZERO) > 0) {
            percentage = spent.divide(budget.getAllocatedAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        boolean isOverBudget = spent.compareTo(budget.getAllocatedAmount()) > 0;

        return new BudgetDto(
                budget.getId(),
                budget.getCategory(),
                budget.getAllocatedAmount(),
                spent,
                remaining,
                percentage,
                isOverBudget,
                budget.getMonth(),
                budget.getYear()
        );
    }
}

