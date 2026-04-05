package com.wishdish.backend.dtos;

import java.util.List;

public class ComandaRequestDTO {

    private Long mesaId;
    private List<Long> productosIds;

    public ComandaRequestDTO() {
    }

    public Long getMesaId() {
        return mesaId;
    }

    public void setMesaId(Long mesaId) {
        this.mesaId = mesaId;
    }

    public List<Long> getProductosIds() {
        return productosIds;
    }

    public void setProductosIds(List<Long> productosIds) {
        this.productosIds = productosIds;
    }
}
