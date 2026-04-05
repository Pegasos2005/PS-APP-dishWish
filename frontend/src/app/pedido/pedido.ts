import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComandaService } from '../services/comanda.service';
import { ComandaResponseDTO } from '../models/comanda.model';
import { interval, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-pedido',
  imports: [CommonModule],
  templateUrl: './pedido.html',
  styleUrl: './pedido.css',
  standalone: true
})
export class Pedido implements OnInit, OnDestroy {
  comandas: ComandaResponseDTO[] = [];
  errorConexion = false;
  private pollingSubscription?: Subscription;

  constructor(private comandaService: ComandaService) {}

  ngOnInit() {
    this.cargarComandasActivas();
    this.iniciarPolling();
  }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  cargarComandasActivas() {
    this.comandaService.getComandasActivas()
      .pipe(
        catchError(error => {
          console.error('Error al cargar comandas:', error);
          this.errorConexion = true;
          return of([]);
        })
      )
      .subscribe(comandas => {
        this.comandas = comandas;
        this.errorConexion = false;
      });
  }

  iniciarPolling() {
    this.pollingSubscription = interval(3000)
      .pipe(
        switchMap(() => this.comandaService.getComandasActivas()),
        catchError(error => {
          console.error('Error en polling:', error);
          this.errorConexion = true;
          return of([]);
        })
      )
      .subscribe(comandas => {
        this.comandas = comandas;
        this.errorConexion = false;
      });
  }
}
