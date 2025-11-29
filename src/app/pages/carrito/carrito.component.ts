import { Component, OnInit, computed, inject, signal, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CartService } from '../../core/services/cart.service';
import { ProductosService } from '../../core/services/productos.service';
import { PerfilService } from '../../core/services/perfil.service';
import { ConfigService } from '../../core/services/config.service';
import { HeaderService } from '../../core/services/header.service';

import { Cart } from '../../core/interfaces/carrito';
import { Producto } from '../../core/interfaces/productos';
import { ContadorCantidadComponent } from '../../components/contador-cantidad/contador-cantidad.component';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, ContadorCantidadComponent, MatSnackBarModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent implements OnInit {

  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;

  // Servicios inyectados
  cartService = inject(CartService);
  productosService = inject(ProductosService);
  perfilService = inject(PerfilService);
  configService = inject(ConfigService);
  headerService = inject(HeaderService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  productosCarrito = signal<{ producto: Producto, cantidad: number, notas: string }[]>([]);

  subtotal = computed(() => {
    return this.productosCarrito().reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  });

  total = computed(() => {
    return this.subtotal() + this.configService.configuracion().costoEnvio;
  });

  constructor() {
    effect(async () => {
      const carro = this.cartService.carrito();
      if (carro.length === 0) {
        this.productosCarrito.set([]);
        return;
      }

      const productosCompletos = await Promise.all(
        carro.map(async (item: Cart) => {
          const producto = await this.productosService.getById(item.idProducto);
          return { 
            producto: producto! as Producto,
            cantidad: item.cantidad, 
            notas: item.notas 
          };
        })
      );
      this.productosCarrito.set(productosCompletos);
    });
  }

  ngOnInit(): void {
    this.headerService.titulo.set('Mi Carrito');
    this.headerService.extendido.set(false);
  }

  cambiarCantidadProducto(item: {idProducto: number, cantidad: number}) {
    this.cartService.cambiarCantidadProducto(item.idProducto, item.cantidad);
  }

  eliminarProducto(id: number) {
    this.cartService.eliminarProducto(id);
  }

  enviarMensaje() {
    const perfil = this.perfilService.perfil();
    // Si el perfil no está completo, notifica y redirige al usuario
    if (!perfil || !perfil.nombre || !perfil.direccion || !perfil.telefono) {
      this.snackBar.open('Por favor, completa tu perfil para poder realizar el pedido.', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/perfil']);
      return;
    }

    let mensaje = "Hola, me gustaría hacer el siguiente pedido:\n\n";
    this.productosCarrito().forEach(item => {
      mensaje += `- ${item.cantidad}x ${item.producto.nombre}\n`;
      if(item.notas) mensaje += `  (Notas: ${item.notas})\n`;
    });
    mensaje += `\nSubtotal: $${this.subtotal()}`;
    mensaje += `\nCosto de envío: $${this.configService.configuracion().costoEnvio}`;
    mensaje += `\nTotal: $${this.total()}\n\n`;
    mensaje += "Datos de envío:\n";
    mensaje += `Nombre: ${perfil.nombre}\n`;
    mensaje += `Dirección: ${perfil.direccion}\n`;
    if (perfil.detalleEntrega) {
      mensaje += `Detalles: ${perfil.detalleEntrega}\n`;
    }
    mensaje += `Teléfono: ${perfil.telefono}`;

    const numeroAdmin = this.configService.configuracion().numeroAdmin;
    const url = `https://wa.me/${numeroAdmin}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    this.dialog.nativeElement.showModal();
  }

  finalizarPedido() {
    this.cartService.vaciar();
    this.dialog.nativeElement.close();
  }

  editarPedido() {
    this.dialog.nativeElement.close();
  }
}
