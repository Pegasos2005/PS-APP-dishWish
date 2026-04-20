package com.wishdish.models;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "ingredients")
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal extraPrice = BigDecimal.ZERO;

    // Constructor vacío
    public Ingredient() {
    }

    // Constructor con parámetros
    public Ingredient(String name) {
        this.name = name;
    }

    // Getters y Setters
    public Integer getId() {
        return id;
    }


    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getExtraPrice() { return extraPrice; }

    public void setExtraPrice(BigDecimal extraPrice) { this.extraPrice = extraPrice; }
}
