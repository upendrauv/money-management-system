package com.moneymanager.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryDto {

    // Financial Overview (Month)
    private BigDecimal currentMonthIncome;
    private BigDecimal currentMonthExpenses;
    private BigDecimal currentMonthSavings;
    private double currentMonthSavingsRate;

    // All Time Totals
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netBalance;

    // Budget Overview (Month)
    private BigDecimal totalBudget;
    private BigDecimal totalBudgetSpent;
    private BigDecimal totalBudgetRemaining;
    private double budgetUsagePercentage;

    // Bills Overview
    private long pendingBillsCount;
    private long overdueBillsCount;
    private BigDecimal pendingBillsAmount;

    // Detailed Lists
    private List<IncomeDto> recentIncomes;
    private List<ExpenseDto> recentExpenses;
    private List<BillDto> upcomingBills;
    private List<CategoryExpenseDto> categoryExpenses;
    private List<BudgetDto> budgetComparison;
    private List<MonthlyOverviewDto> monthlyTrends;

    public DashboardSummaryDto() {
    }

    public BigDecimal getCurrentMonthIncome() {
        return currentMonthIncome;
    }

    public void setCurrentMonthIncome(BigDecimal currentMonthIncome) {
        this.currentMonthIncome = currentMonthIncome;
    }

    public BigDecimal getCurrentMonthExpenses() {
        return currentMonthExpenses;
    }

    public void setCurrentMonthExpenses(BigDecimal currentMonthExpenses) {
        this.currentMonthExpenses = currentMonthExpenses;
    }

    public BigDecimal getCurrentMonthSavings() {
        return currentMonthSavings;
    }

    public void setCurrentMonthSavings(BigDecimal currentMonthSavings) {
        this.currentMonthSavings = currentMonthSavings;
    }

    public double getCurrentMonthSavingsRate() {
        return currentMonthSavingsRate;
    }

    public void setCurrentMonthSavingsRate(double currentMonthSavingsRate) {
        this.currentMonthSavingsRate = currentMonthSavingsRate;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getNetBalance() {
        return netBalance;
    }

    public void setNetBalance(BigDecimal netBalance) {
        this.netBalance = netBalance;
    }

    public BigDecimal getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(BigDecimal totalBudget) {
        this.totalBudget = totalBudget;
    }

    public BigDecimal getTotalBudgetSpent() {
        return totalBudgetSpent;
    }

    public void setTotalBudgetSpent(BigDecimal totalBudgetSpent) {
        this.totalBudgetSpent = totalBudgetSpent;
    }

    public BigDecimal getTotalBudgetRemaining() {
        return totalBudgetRemaining;
    }

    public void setTotalBudgetRemaining(BigDecimal totalBudgetRemaining) {
        this.totalBudgetRemaining = totalBudgetRemaining;
    }

    public double getBudgetUsagePercentage() {
        return budgetUsagePercentage;
    }

    public void setBudgetUsagePercentage(double budgetUsagePercentage) {
        this.budgetUsagePercentage = budgetUsagePercentage;
    }

    public long getPendingBillsCount() {
        return pendingBillsCount;
    }

    public void setPendingBillsCount(long pendingBillsCount) {
        this.pendingBillsCount = pendingBillsCount;
    }

    public long getOverdueBillsCount() {
        return overdueBillsCount;
    }

    public void setOverdueBillsCount(long overdueBillsCount) {
        this.overdueBillsCount = overdueBillsCount;
    }

    public BigDecimal getPendingBillsAmount() {
        return pendingBillsAmount;
    }

    public void setPendingBillsAmount(BigDecimal pendingBillsAmount) {
        this.pendingBillsAmount = pendingBillsAmount;
    }

    public List<IncomeDto> getRecentIncomes() {
        return recentIncomes;
    }

    public void setRecentIncomes(List<IncomeDto> recentIncomes) {
        this.recentIncomes = recentIncomes;
    }

    public List<ExpenseDto> getRecentExpenses() {
        return recentExpenses;
    }

    public void setRecentExpenses(List<ExpenseDto> recentExpenses) {
        this.recentExpenses = recentExpenses;
    }

    public List<BillDto> getUpcomingBills() {
        return upcomingBills;
    }

    public void setUpcomingBills(List<BillDto> upcomingBills) {
        this.upcomingBills = upcomingBills;
    }

    public List<CategoryExpenseDto> getCategoryExpenses() {
        return categoryExpenses;
    }

    public void setCategoryExpenses(List<CategoryExpenseDto> categoryExpenses) {
        this.categoryExpenses = categoryExpenses;
    }

    public List<BudgetDto> getBudgetComparison() {
        return budgetComparison;
    }

    public void setBudgetComparison(List<BudgetDto> budgetComparison) {
        this.budgetComparison = budgetComparison;
    }

    public List<MonthlyOverviewDto> getMonthlyTrends() {
        return monthlyTrends;
    }

    public void setMonthlyTrends(List<MonthlyOverviewDto> monthlyTrends) {
        this.monthlyTrends = monthlyTrends;
    }
}

