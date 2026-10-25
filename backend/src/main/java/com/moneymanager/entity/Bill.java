package com.moneymanager.entity;

import com.moneymanager.entity.enums.BillFrequency;
import com.moneymanager.entity.enums.BillStatus;
import com.moneymanager.entity.enums.TransactionCategory;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills", indexes = {
    @Index(name = "idx_bill_user_due_date", columnList = "user_id, due_date"),
    @Index(name = "idx_bill_status", columnList = "user_id, status")
})
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TransactionCategory category;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BillStatus status = BillStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BillFrequency frequency = BillFrequency.MONTHLY;

    @Column(name = "is_recurring", nullable = false)
    private Boolean isRecurring = true;

    @Column(name = "paid_date")
    private LocalDate paidDate;

    @Column(name = "reminder_days_before")
    private Integer reminderDaysBefore = 3;

    @Column(length = 500)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Bill() {
    }

    public Bill(String title, BigDecimal amount, TransactionCategory category, LocalDate dueDate,
                BillStatus status, BillFrequency frequency, Boolean isRecurring, Integer reminderDaysBefore,
                String notes, User user) {
        this.title = title;
        this.amount = amount;
        this.category = category;
        this.dueDate = dueDate;
        this.status = status != null ? status : BillStatus.PENDING;
        this.frequency = frequency != null ? frequency : BillFrequency.MONTHLY;
        this.isRecurring = isRecurring != null ? isRecurring : true;
        this.reminderDaysBefore = reminderDaysBefore != null ? reminderDaysBefore : 3;
        this.notes = notes;
        this.user = user;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = BillStatus.PENDING;
        }
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

