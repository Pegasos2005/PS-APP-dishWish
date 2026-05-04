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
                // Mapear los ProductIngredient existentes por su ID de Ingrediente para una búsqueda eficiente
                Map<Integer, ProductIngredient> existingPisMap = existingProduct.getProductIngredients().stream()
                        .collect(Collectors.toMap(pi -> pi.getIngredient().getId(), Function.identity()));

                // Crear una lista temporal para los ProductIngredient que deben permanecer o ser añadidos/actualizados
                // Esto nos permite manipular la colección sin modificarla directamente durante la iteración
                Set<ProductIngredient> pisToKeepOrAdd = new java.util.HashSet<>();

                for (ProductIngredient piRequest : productDetails.getProductIngredients()) {
                    if (piRequest.getIngredient() != null && piRequest.getIngredient().getId() != null) {
                        Integer ingredientId = piRequest.getIngredient().getId();
                        ProductIngredient existingPi = existingPisMap.get(ingredientId);

                        if (existingPi != null) {
                            // El ingrediente ya existe, actualizamos sus propiedades (ej. isDefault)
                            existingPi.setDefault(piRequest.isDefault());
                            pisToKeepOrAdd.add(existingPi);
                            // Lo removemos del mapa para que los restantes sean los que hay que eliminar
                            existingPisMap.remove(ingredientId);
                        } else {
                            // Es un nuevo ingrediente a añadir
                            Ingredient ingredient = ingredientRepository.findById(ingredientId)
                                    .orElseThrow(() -> new RuntimeException("Ingrediente con ID " + ingredientId + " no encontrado"));

                            ProductIngredient newPi = new ProductIngredient();
                            newPi.setProduct(existingProduct); // Asegurar el enlace bidireccional
                            newPi.setIngredient(ingredient);
                            newPi.setDefault(piRequest.isDefault());
                            pisToKeepOrAdd.add(newPi);
                        }
                    }
                }

                // Reemplazamos el contenido de la lista original directamente. 
                // JPA/Hibernate gestionará el orphanRemoval basándose en los elementos que ya no estén.
                existingProduct.getProductIngredients().clear();
                existingProduct.getProductIngredients().addAll(pisToKeepOrAdd);

            } else {
                // Si productDetails.getProductIngredients() es null, se interpretará que se quieren eliminar todos los ingredientes existentes.
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