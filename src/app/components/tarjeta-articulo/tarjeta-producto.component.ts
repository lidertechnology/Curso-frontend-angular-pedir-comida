import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Producto } from '../../core/interfaces/productos';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-tarjeta-producto',
  templateUrl: './tarjeta-producto.component.html',
  styleUrls: ['./tarjeta-producto.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TarjetaArticuloComponent {

  @Input({required:true}) producto!:Producto;
  cartService = inject(CartService);

  agregarAlCarrito(event:MouseEvent){
    event.stopPropagation();
    this.cartService.agregarProducto(this.producto.id, 1, "");
  }
}
