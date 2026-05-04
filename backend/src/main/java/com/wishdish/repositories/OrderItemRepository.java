package com.wishdish.repositories;

import com.wishdish.models.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    // Busca todos los items que contengan el nombre del ingrediente
    List<OrderItem> findByAddedExtrasContaining(String name);
}