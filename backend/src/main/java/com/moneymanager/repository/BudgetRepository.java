package com.moneymanager.repository;

import com.moneymanager.entity.Budget;
import com.moneymanager.entity.User;
import com.moneymanager.entity.enums.TransactionCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserAndMonthAndYear(User user, Integer month, Integer year);

    Optional<Budget> findByUserAndCategoryAndMonthAndYear(User user, TransactionCategory category, Integer month, Integer year);

    @Query("SELECT COALESCE(SUM(b.allocatedAmount), 0) FROM Budget b WHERE b.user = :user AND b.month = :month AND b.year = :year")
    BigDecimal sumAllocatedAmountByUserAndMonthAndYear(@Param("user") User user, @Param("month") Integer month, @Param("year") Integer year);
}

