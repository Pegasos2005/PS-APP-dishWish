import { Component } from '@angular/core';

@Component({
  selector: 'app-pedido',
  imports: [],
  templateUrl: './pedido.html',
  styleUrl: './pedido.css',
})

// Función que prueba que el botón funciona
export class Pedido {
  // Función vacía para que el botón tenga donde llamar
  enviarComanda() {
    // Mensaje de que el botón funciona
    console.log("Boton pulsado: Enviando comanda a cocina...");
    alert("¡Comanda enviada con exito!");
    }
}
