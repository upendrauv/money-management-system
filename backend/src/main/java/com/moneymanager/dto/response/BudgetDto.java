package com.moneymanager.dto.response;

import com.moneymanager.entity.enums.TransactionCategory;
import java.math.BigDecimal;

public class BudgetDto {

    private Long id;
    private TransactionCategory category;
    private BigDecimal allocatedAmount;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private double percentageSpent;
    private boolean isOverBudget;
    private Integer month;
    private Integer year;

    public BudgetDto() {
    }

    public BudgetDto(Long id, TransactionCategory category, BigDecimal allocatedAmount, BigDecimal spentAmount,
                     BigDecimal remainingAmount, double percentageSpent, boolean isOverBudget,
                     Integer month, Integer year) {
        this.id = id;
        this.category = category;
        this.allocatedAmount = allocatedAmount;
        this.spentAmount = spentAmount;
        this.remainingAmount = remainingAmount;
        this.percentageSpent = percentageSpent;
        this.isOverBudget = isOverBudget;
        this.month = month;
        this.year = year;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TransactionCategory getCategory() {
        return category;
    }

    public void setCategory(TransactionCategory category) {
        this.category = category;
    }

    public BigDecimal getAllocatedAmount() {
        return allocatedAmount;
    }

    public void setAllocatedAmount(BigDecimal allocatedAmount) {
        this.allocatedAmount = allocatedAmount;
    }

    public BigDecimal getSpentAmount() {
        return spentAmount;
    }

    public void setSpentAmount(BigDecimal spentAmount) {
        this.spentAmount = spentAmount;
    }

    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(BigDecimal remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public double getPercentageSpent() {
        return percentageSpent;
    }

    public void setPercentageSpent(double percentageSpent) {
        this.percentageSpent = percentageSpent;
    }

    public boolean isOverBudget() {
        return isOverBudget;
    }

    public void setOverBudget(boolean overBudget) {
        isOverBudget = overBudget;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }
}

