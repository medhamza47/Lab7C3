package com.edumanager;

import jakarta.validation.constraints.*;

public record StudentInput(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank @Email String email,
        @NotBlank String major,
        @NotNull @Past java.time.LocalDate birthDate,
        @NotNull @DecimalMin("0") @DecimalMax("20") @Digits(integer = 2, fraction = 2) java.math.BigDecimal grade,
        @NotEmpty java.util.List<@NotBlank String> programs
) {}
