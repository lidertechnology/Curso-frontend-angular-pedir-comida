import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { Producto } from '../interfaces/productos';
import { Categoria } from '../interfaces/categorias';
import { Busqueda } from '../interfaces/busqueda';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  http = inject(HttpClient);
  private data: WritableSignal<Categoria[]> = signal([]);

  constructor() {
    this.fetchData();
  }

  private async fetchData(): Promise<void> {
    try {
      const res = await firstValueFrom(this.http.get<Categoria[]>("assets/data/database.json"));
      this.data.set(res);
    } catch (error) {
      console.error("Error fetching data for ProductosService:", error);
      // Handle the error appropriately, maybe set data to an empty array
      this.data.set([]);
    }
  }

  private getAllProductsFromCache(): Producto[] {
    let productos: Producto[] = [];
    this.data().forEach(categoria => {
      productos = [...productos, ...categoria.productos];
    });
    return productos;
  }

  async getByCategoria(id: number): Promise<Producto[]> {
    if (this.data().length === 0) await this.fetchData(); // Ensure data is loaded
    const productos = this.data().find(categoria => categoria.id === id)?.productos;
    return productos || [];
  }

  async getAll(): Promise<Producto[]> {
    if (this.data().length === 0) await this.fetchData(); // Ensure data is loaded
    return this.getAllProductsFromCache();
  }

  async getById(id: number): Promise<Producto | undefined> {
    if (this.data().length === 0) await this.fetchData(); // Ensure data is loaded
    const productos = this.getAllProductsFromCache();
    return productos.find(producto => producto.id === id);
  }

  async buscar(parametros: Busqueda): Promise<Producto[]> {
    if (this.data().length === 0) await this.fetchData(); // Ensure data is loaded
    const productos = this.getAllProductsFromCache();
    return productos.filter(producto => {
      if (parametros.aptoCeliaco && !producto.esCeliaco) return false;
      if (parametros.aptoVegano && !producto.esVegano) return false;

      const textoBusqueda = parametros.texto.toLowerCase();
      if (!textoBusqueda) return true; // if search text is empty, return all (respecting filters)

      const enNombre = producto.nombre.toLowerCase().includes(textoBusqueda);
      if (enNombre) return true;

      return producto.ingredientes.some(ingrediente => 
        ingrediente.toLowerCase().includes(textoBusqueda)
      );
    });
  }
}
