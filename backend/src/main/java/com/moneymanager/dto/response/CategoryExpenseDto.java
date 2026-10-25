package com.moneymanager.dto.response;

import com.moneymanager.entity.enums.TransactionCategory;
import java.math.BigDecimal;

public class CategoryExpenseDto {

    private TransactionCategory category;
    private BigDecimal amount;
    private double percentage;

    public CategoryExpenseDto() {
    }

    public CategoryExpenseDto(TransactionCategory category, BigDecimal amount, double percentage) {
        this.category = category;
        this.amount = amount;
        this.percentage = percentage;
    }

    public TransactionCategory getCategory() {
        return category;
    }

    public void setCategory(TransactionCategory category) {
        this.category = category;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}

