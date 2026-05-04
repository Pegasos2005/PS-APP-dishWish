package com.wishdish.repositories;

import com.wishdish.models.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
// En IngredientRepository.java
public interface IngredientRepository extends JpaRepository<Ingredient, Integer> {
    // Busca simplemente por nombre. Si el ingrediente se borró, simplemente no lo encontrará.
    Optional<Ingredient> findByName(String name);
}