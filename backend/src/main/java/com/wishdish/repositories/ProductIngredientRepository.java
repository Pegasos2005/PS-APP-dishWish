package com.wishdish.repositories;

import com.wishdish.models.ProductIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductIngredientRepository extends JpaRepository<ProductIngredient, Integer> {

    /**
     * Borra todos los registros de la tabla product_ingredients
     * que estén asociados a un ID de ingrediente específico.
     * * @Modifying: Indica que esta consulta altera datos (DELETE).
     * @Query: Definimos la consulta personalizada.
     */
    @Modifying
    @Query("DELETE FROM ProductIngredient pi WHERE pi.ingredient.id = :ingredientId")
    void deleteByIngredientId(@Param("ingredientId") Integer ingredientId);

}