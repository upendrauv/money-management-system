package com.moneymanager.dto.response;

import com.moneymanager.entity.enums.BillFrequency;
import com.moneymanager.entity.enums.BillStatus;
import com.moneymanager.entity.enums.TransactionCategory;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BillDto {

    private Long id;
    private String title;
    private BigDecimal amount;
    private TransactionCategory category;
    private LocalDate dueDate;
    private BillStatus status;
    private BillFrequency frequency;
    private Boolean isRecurring;
    private LocalDate paidDate;
    private Integer reminderDaysBefore;
    private String notes;
    private boolean isOverdue;
    private long daysRemaining;
    private LocalDateTime createdAt;

    public BillDto() {
    }

    public BillDto(Long id, String title, BigDecimal amount, TransactionCategory category, LocalDate dueDate,
                   BillStatus status, BillFrequency frequency, Boolean isRecurring, LocalDate paidDate,
                   Integer reminderDaysBefore, String notes, boolean isOverdue, long daysRemaining,
                   LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.category = category;
        this.dueDate = dueDate;
        this.status = status;
        this.frequency = frequency;
        this.isRecurring = isRecurring;
        this.paidDate = paidDate;
        this.reminderDaysBefore = reminderDaysBefore;
        this.notes = notes;
        this.isOverdue = isOverdue;
        this.daysRemaining = daysRemaining;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDate getPaidDate() {
        return paidDate;
    }

    public void setPaidDate(LocalDate paidDate) {
        this.paidDate = paidDate;
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

    public boolean isOverdue() {
        return isOverdue;
    }

    public void setOverdue(boolean overdue) {
        isOverdue = overdue;
    }

    public long getDaysRemaining() {
        return daysRemaining;
    }

    public void setDaysRemaining(long daysRemaining) {
        this.daysRemaining = daysRemaining;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

