import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Cart } from '../interfaces/carrito';
import { ConfigService } from './config.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  carrito: WritableSignal<Cart[]> = signal([]);
  config = inject(ConfigService);
  notificationService = inject(NotificationService);

  constructor() { }

  initCart(){
    const cart = localStorage.getItem("cart");
    if(cart) {
      const carritoGuardado = JSON.parse(cart);
      if(carritoGuardado){
        const fechaGuardado = new Date(carritoGuardado.fecha);
        const fecha = new Date();
        if(fecha.getTime() - fechaGuardado.getTime() > 1000*60*60*24*this.config.configuracion().diasVencimientoCarrito){
          this.vaciar();
        } else {
          this.carrito.set(carritoGuardado.productos);
        }
      }
    }
  }

  agregarProducto(idProducto:number, cantidad: number, notas:string){
    this.carrito.update(currentCart => {
        const i = currentCart.findIndex(p => p.idProducto === idProducto);
        if (i === -1) {
            const nuevoProducto: Cart = { idProducto, cantidad, notas };
            return [...currentCart, nuevoProducto];
        }
        
        return currentCart.map((producto, index) => {
            if (index === i) {
                return { ...producto, cantidad: producto.cantidad + cantidad };
            }
            return producto;
        });
    });
    this.actualizarAlmacenamiento();
    this.notificationService.mostrarNotificacion('Producto agregado al carrito');
  }

  eliminarProducto(idProducto:number){
    this.carrito.update(currentCart => currentCart.filter(producto => producto.idProducto !== idProducto));
    if(this.carrito().length === 0){
      localStorage.removeItem("cart");
    } else {
      this.actualizarAlmacenamiento();
    }
    this.notificationService.mostrarNotificacion('Producto eliminado del carrito');
  }

  cambiarCantidadProducto(idProducto:number, cantidad: number){
    this.carrito.update(currentCart => {
      return currentCart.map(producto => {
        if(producto.idProducto === idProducto) {
          return {...producto, cantidad: cantidad}
        };
        return producto;
      })
    })
    this.actualizarAlmacenamiento();
    this.notificationService.mostrarNotificacion('Cantidad del producto actualizada');
  }

  actualizarAlmacenamiento(){
    const fecha = new Date();
    const elementoAGuardar = {
      fecha,
      productos:this.carrito()
    }
    localStorage.setItem("cart",JSON.stringify(elementoAGuardar));
  }

  vaciar(){
    this.carrito.set([]);
    localStorage.removeItem("cart");
  }
}
