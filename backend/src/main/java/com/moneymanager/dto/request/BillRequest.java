package com.moneymanager.dto.request;

import com.moneymanager.entity.enums.BillFrequency;
import com.moneymanager.entity.enums.BillStatus;
import com.moneymanager.entity.enums.TransactionCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class BillRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Category is required")
    private TransactionCategory category;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private BillStatus status = BillStatus.PENDING;

    private BillFrequency frequency = BillFrequency.MONTHLY;

    private Boolean isRecurring = true;

    private Integer reminderDaysBefore = 3;

    private String notes;

    public BillRequest() {
    }

    public BillRequest(String title, BigDecimal amount, TransactionCategory category, LocalDate dueDate,
                       BillStatus status, BillFrequency frequency, Boolean isRecurring,
                       Integer reminderDaysBefore, String notes) {
        this.title = title;
        this.amount = amount;
        this.category = category;
        this.dueDate = dueDate;
        this.status = status;
        this.frequency = frequency;
        this.isRecurring = isRecurring;
        this.reminderDaysBefore = reminderDaysBefore;
        this.notes = notes;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public TransactionCategory getCategory() {
        return category;
    }

    public void setCategory(TransactionCategory category) {
        this.category = category;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public BillStatus getStatus() {
        return status;
    }

    public void setStatus(BillStatus status) {
        this.status = status;
    }

    public BillFrequency getFrequency() {
        return frequency;
    }

    public void setFrequency(BillFrequency frequency) {
        this.frequency = frequency;
    }

    public Boolean getIsRecurring() {
        return isRecurring;
    }

    public void setIsRecurring(Boolean isRecurring) {
        this.isRecurring = isRecurring;
    }

    public Integer getReminderDaysBefore() {
        return reminderDaysBefore;
    }

    public void setReminderDaysBefore(Integer reminderDaysBefore) {
        this.reminderDaysBefore = reminderDaysBefore;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

