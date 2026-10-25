package com.moneymanager.service;

import com.moneymanager.dto.response.*;
import com.moneymanager.entity.Bill;
import com.moneymanager.entity.Expense;
import com.moneymanager.entity.Income;
import com.moneymanager.entity.User;
import com.moneymanager.entity.enums.BillStatus;
import com.moneymanager.repository.*;
import com.moneymanager.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;

@Service
public class DashboardService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final BillRepository billRepository;
    private final BudgetRepository budgetRepository;
    private final AuthService authService;
    private final IncomeService incomeService;
    private final ExpenseService expenseService;
    private final BillService billService;
    private final BudgetService budgetService;

    public DashboardService(IncomeRepository incomeRepository,
                            ExpenseRepository expenseRepository,
                            BillRepository billRepository,
                            BudgetRepository budgetRepository,
                            AuthService authService,
                            IncomeService incomeService,
                            ExpenseService expenseService,
                            BillService billService,
                            BudgetService budgetService) {
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.billRepository = billRepository;
        this.budgetRepository = budgetRepository;
        this.authService = authService;
        this.incomeService = incomeService;
        this.expenseService = expenseService;
        this.billService = billService;
        this.budgetService = budgetService;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryDto getDashboardSummary(UserPrincipal principal, Integer month, Integer year) {
        User user = authService.getUserEntity(principal);

        int targetMonth = month != null ? month : LocalDate.now().getMonthValue();
        int targetYear = year != null ? year : LocalDate.now().getYear();

        YearMonth ym = YearMonth.of(targetYear, targetMonth);
        LocalDate startOfMonth = ym.atDay(1);
        LocalDate endOfMonth = ym.atEndOfMonth();

        // Monthly Financials
        BigDecimal monthIncome = incomeRepository.sumByUserAndDateBetween(user, startOfMonth, endOfMonth);
        BigDecimal monthExpenses = expenseRepository.sumByUserAndDateBetween(user, startOfMonth, endOfMonth);
        BigDecimal monthSavings = monthIncome.subtract(monthExpenses);

        double savingsRate = 0.0;
        if (monthIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = monthSavings.divide(monthIncome, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        // All Time Totals
        BigDecimal totalIncome = incomeRepository.sumAllByUser(user);
        BigDecimal totalExpenses = expenseRepository.sumAllByUser(user);
        BigDecimal netBalance = totalIncome.subtract(totalExpenses);

        // Budget Calculations
        BigDecimal totalBudget = budgetRepository.sumAllocatedAmountByUserAndMonthAndYear(user, targetMonth, targetYear);
        BigDecimal totalBudgetSpent = monthExpenses;
        BigDecimal totalBudgetRemaining = totalBudget.subtract(totalBudgetSpent);
        double budgetUsage = 0.0;
        if (totalBudget.compareTo(BigDecimal.ZERO) > 0) {
            budgetUsage = totalBudgetSpent.divide(totalBudget, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        // Bills Status
        LocalDate today = LocalDate.now();
        List<Bill> allBills = billRepository.findByUserOrderByDueDateAsc(user);
        long pendingCount = 0;
        long overdueCount = 0;
        BigDecimal pendingAmount = BigDecimal.ZERO;

        for (Bill b : allBills) {
            if (b.getStatus() == BillStatus.PENDING || b.getStatus() == BillStatus.OVERDUE) {
                if (b.getDueDate().isBefore(today)) {
                    overdueCount++;
                } else {
                    pendingCount++;
                }
                pendingAmount = pendingAmount.add(b.getAmount());
            }
        }

        // Lists
        List<IncomeDto> recentIncomes = incomeRepository.findByUserOrderByDateDesc(user)
                .stream().limit(5).map(incomeService::mapToDto).toList();

        List<ExpenseDto> recentExpenses = expenseRepository.findByUserOrderByDateDesc(user)
                .stream().limit(5).map(expenseService::mapToDto).toList();

        List<BillDto> upcomingBills = allBills.stream()
                .filter(b -> b.getStatus() != BillStatus.PAID)
                .limit(5)
                .map(billService::mapToDto)
                .toList();

        // Category Expenses Breakdown
        List<ExpenseRepository.CategorySum> catSums =
                expenseRepository.findCategoryTotalsByUserAndDateBetween(user, startOfMonth, endOfMonth);

        List<CategoryExpenseDto> categoryExpenses = new ArrayList<>();
        for (ExpenseRepository.CategorySum cs : catSums) {
            double pct = 0.0;
            if (monthExpenses.compareTo(BigDecimal.ZERO) > 0) {
                pct = cs.getTotal().divide(monthExpenses, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();
            }
            categoryExpenses.add(new CategoryExpenseDto(cs.getCategory(), cs.getTotal(), pct));
        }

        // Budget Comparison
        List<BudgetDto> budgetComparison = budgetService.getBudgets(principal, targetMonth, targetYear);

        // 6 Month Trends
        List<MonthlyOverviewDto> monthlyTrends = getMonthlyTrends(user, 6);

        DashboardSummaryDto dto = new DashboardSummaryDto();
        dto.setCurrentMonthIncome(monthIncome);
        dto.setCurrentMonthExpenses(monthExpenses);
        dto.setCurrentMonthSavings(monthSavings);
        dto.setCurrentMonthSavingsRate(savingsRate);

        dto.setTotalIncome(totalIncome);
        dto.setTotalExpenses(totalExpenses);
        dto.setNetBalance(netBalance);

        dto.setTotalBudget(totalBudget);
        dto.setTotalBudgetSpent(totalBudgetSpent);
        dto.setTotalBudgetRemaining(totalBudgetRemaining);
        dto.setBudgetUsagePercentage(budgetUsage);

        dto.setPendingBillsCount(pendingCount);
        dto.setOverdueBillsCount(overdueCount);
        dto.setPendingBillsAmount(pendingAmount);

        dto.setRecentIncomes(recentIncomes);
        dto.setRecentExpenses(recentExpenses);
        dto.setUpcomingBills(upcomingBills);
        dto.setCategoryExpenses(categoryExpenses);
        dto.setBudgetComparison(budgetComparison);
        dto.setMonthlyTrends(monthlyTrends);

        return dto;
    }

    private List<MonthlyOverviewDto> getMonthlyTrends(User user, int monthsCount) {
        List<MonthlyOverviewDto> trends = new ArrayList<>();
        YearMonth current = YearMonth.now();

        for (int i = monthsCount - 1; i >= 0; i--) {
            YearMonth target = current.minusMonths(i);
            LocalDate start = target.atDay(1);
            LocalDate end = target.atEndOfMonth();

            BigDecimal inc = incomeRepository.sumByUserAndDateBetween(user, start, end);
            BigDecimal exp = expenseRepository.sumByUserAndDateBetween(user, start, end);
            BigDecimal net = inc.subtract(exp);

            String monthName = target.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + target.getYear();

            trends.add(new MonthlyOverviewDto(target.getMonthValue(), target.getYear(), monthName, inc, exp, net));
        }

        return trends;
    }
}

