package com.wishDishDevelops.backend.services;

import com.wishDishDevelops.backend.models.Order;
import com.wishDishDevelops.backend.models.OrderItem;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {

    // Recibe el ID de la mesa y la lista de IDs de los productos
    public Order createOrder(Integer tableId, List<Integer> productIds) {
        return null; // TODO: Implementar luego
    }

    // Devuelve las comandas que no estén pagadas ni terminadas
    public List<Order> getActiveOrders() {
        return null; // TODO: Implementar luego
    }

    // Avanza el estado de un plato y comprueba si la comanda entera ya está lista
    public OrderItem advanceItemStatus(Integer itemId) {
        return null; // TODO: Implementar luego
    }
}