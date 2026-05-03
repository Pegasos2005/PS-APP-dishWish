package com.wishdish.controllers; // Ajusta el paquete según tu estructura

import com.wishdish.dtos.ProductDTO;
import com.wishdish.models.Product;
import com.wishdish.models.ProductIngredient;
import com.wishdish.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@RestController
@RequestMapping("/api/products") // Esta es la URL exacta que tu Angular está llamando
@CrossOrigin(origins = "http://localhost:4200") // Permite que Angular (4200) hable con Spring (8080)
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        // Devuelve la lista completa de productos
        return productRepository.findAll();
    }

    // Opcional: Si luego quieres filtrar por categoría, ya tienes el repo listo para esto:
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Integer categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Integer id) {
        return productRepository.findById(id)
                .map(product -> ResponseEntity.ok(new ProductDTO(product))) // AQUÍ ESTÁ LA MAGIA
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Integer id, @RequestBody Product productDetails) {
        return productRepository.findById(id).map(existingProduct -> {
            // 1. Actualizar datos básicos
            existingProduct.setName(productDetails.getName());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setPicture(productDetails.getPicture());

            // 2. CORRECCIÓN: Sincronizar ingredientes
            if (productDetails.getProductIngredients() != null) {
                // Limpiamos los ingredientes actuales (esto borra los de la BD gracias a orphanRemoval=true)
                existingProduct.getProductIngredients().clear();

                // Añadimos los nuevos que vienen en el JSON
                for (ProductIngredient pi : productDetails.getProductIngredients()) {
                    pi.setProduct(existingProduct); // CRUCIAL: Vincular el hijo al padre
                    existingProduct.getProductIngredients().add(pi);
                }
            }

            // 3. Guardar cambios
            Product updatedProduct = productRepository.save(existingProduct);
            return ResponseEntity.ok(updatedProduct);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        // Vinculamos cada ingrediente al nuevo producto antes de guardar
        if (product.getProductIngredients() != null) {
            for (ProductIngredient pi : product.getProductIngredients()) {
                pi.setProduct(product);
            }
        }
        return ResponseEntity.ok(productRepository.save(product));
    }
}