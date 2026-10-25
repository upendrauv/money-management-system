package com.moneymanager.service;

import com.moneymanager.dto.request.IncomeRequest;
import com.moneymanager.dto.response.IncomeDto;
import com.moneymanager.entity.Income;
import com.moneymanager.entity.User;
import com.moneymanager.exception.ResourceNotFoundException;
import com.moneymanager.repository.IncomeRepository;
import com.moneymanager.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final AuthService authService;

    public IncomeService(IncomeRepository incomeRepository, AuthService authService) {
        this.incomeRepository = incomeRepository;
        this.authService = authService;
    }

    @Transactional
    public IncomeDto createIncome(IncomeRequest request, UserPrincipal principal) {
        User user = authService.getUserEntity(principal);

        Income income = new Income(
                request.getTitle().trim(),
                request.getAmount(),
                request.getCategory(),
                request.getDate(),
                request.getNotes(),
                user
        );

        Income saved = incomeRepository.save(income);
        return mapToDto(saved);
    }

    @Transactional
    public IncomeDto updateIncome(Long id, IncomeRequest request, UserPrincipal principal) {
        User user = authService.getUserEntity(principal);
        Income income = incomeRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Income entry not found with id: " + id));

        income.setTitle(request.getTitle().trim());
        income.setAmount(request.getAmount());
        income.setCategory(request.getCategory());
        income.setDate(request.getDate());
        income.setNotes(request.getNotes());

        Income updated = incomeRepository.save(income);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteIncome(Long id, UserPrincipal principal) {
        User user = authService.getUserEntity(principal);
        Income income = incomeRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Income entry not found with id: " + id));

        incomeRepository.delete(income);
    }

    @Transactional(readOnly = true)
    public IncomeDto getIncomeById(Long id, UserPrincipal principal) {
        User user = authService.getUserEntity(principal);
        Income income = incomeRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Income entry not found with id: " + id));

        return mapToDto(income);
    }

    @Transactional(readOnly = true)
    public List<IncomeDto> getIncomes(UserPrincipal principal, Integer month, Integer year) {
        User user = authService.getUserEntity(principal);

        List<Income> incomes;
        if (month != null && year != null) {
            YearMonth ym = YearMonth.of(year, month);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();
            incomes = incomeRepository.findByUserAndDateBetweenOrderByDateDesc(user, start, end);
        } else {
            incomes = incomeRepository.findByUserOrderByDateDesc(user);
        }

        return incomes.stream().map(this::mapToDto).toList();
    }

    public IncomeDto mapToDto(Income income) {
        return new IncomeDto(
                income.getId(),
                income.getTitle(),
                income.getAmount(),
                income.getCategory(),
                income.getDate(),
                income.getNotes(),
                income.getCreatedAt()
        );
    }
}

