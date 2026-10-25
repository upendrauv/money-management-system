package com.moneymanager.repository;

import com.moneymanager.entity.Bill;
import com.moneymanager.entity.User;
import com.moneymanager.entity.enums.BillStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    List<Bill> findByUserOrderByDueDateAsc(User user);

    List<Bill> findByUserAndStatusOrderByDueDateAsc(User user, BillStatus status);

    List<Bill> findByUserAndDueDateBetweenOrderByDueDateAsc(User user, LocalDate startDate, LocalDate endDate);

    Long countByUserAndStatus(User user, BillStatus status);

    Long countByUserAndDueDateBeforeAndStatus(User user, LocalDate date, BillStatus status);

    Long countByUserAndDueDateBetweenAndStatus(User user, LocalDate startDate, LocalDate endDate, BillStatus status);
}

