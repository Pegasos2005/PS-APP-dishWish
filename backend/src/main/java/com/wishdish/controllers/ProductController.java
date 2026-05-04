package com.wishdish.controllers;

import com.wishdish.dtos.ProductDTO;
import com.wishdish.models.Product;
import com.wishdish.models.ProductIngredient;
import com.wishdish.models.Ingredient;
import com.wishdish.repositories.IngredientRepository;
import com.wishdish.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    // Obtener todos
    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
    }

    // Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Integer id) {
        return productRepository.findById(id)
                .map(product -> ResponseEntity.ok(new ProductDTO(product)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear Producto
    @PostMapping
    @Transactional
    public ResponseEntity<ProductDTO> createProduct(@RequestBody Product product) {
        if (product.getProductIngredients() != null) {
            for (ProductIngredient pi : product.getProductIngredients()) {
                pi.setProduct(product);
            }
        }
        return ResponseEntity.ok(new ProductDTO(productRepository.save(product)));
    }

    // Actualizar Producto - Implementación Robusta
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Integer id, @RequestBody Product productDetails) {
        return productRepository.findById(id).map(existingProduct -> {

            // 1. Actualizar datos básicos
            existingProduct.setName(productDetails.getName());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setPicture(productDetails.getPicture());

            // 2. Gestión de Ingredientes
            if (productDetails.getProductIngredients() != null) {
                // Identificar los IDs de ingredientes que vienen en la petición
                Set<Integer> incomingIds = productDetails.getProductIngredients().stream()
                        .filter(pi -> pi.getIngredient() != null && pi.getIngredient().getId() != null)
                        .map(pi -> pi.getIngredient().getId())
                        .collect(Collectors.toSet());

                // Eliminar de la colección actual los que NO están en la nueva lista
                existingProduct.getProductIngredients().removeIf(pi ->
                        !incomingIds.contains(pi.getIngredient().getId()));

                for (ProductIngredient piRequest : productDetails.getProductIngredients()) {
                    if (piRequest.getIngredient() != null && piRequest.getIngredient().getId() != null) {
                        Integer ingredientId = piRequest.getIngredient().getId();

                        // Buscar si ya existe en la lista que nos quedó
                        ProductIngredient existingPi = existingProduct.getProductIngredients().stream()
                                .filter(pi -> pi.getIngredient().getId().equals(ingredientId))
                                .findFirst().orElse(null);

                        if (existingPi != null) {
                            existingPi.setDefault(piRequest.isDefault());
                        } else {
                            Ingredient ingredient = ingredientRepository.findById(ingredientId)
                                    .orElseThrow(() -> new RuntimeException("Ingrediente con ID " + ingredientId + " no encontrado"));
                            existingProduct.getProductIngredients().add(new ProductIngredient(existingProduct, ingredient, piRequest.isDefault()));
                        }
                    }
                }
            } else {
                existingProduct.getProductIngredients().clear();
            }

            // 3. Guardamos y devolvemos DTO para evitar recursión
            return ResponseEntity.ok(new ProductDTO(productRepository.save(existingProduct)));

        }).orElse(ResponseEntity.notFound().build());
    }

    // Borrar Producto
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}