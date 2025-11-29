import { Routes } from '@angular/router';
import { ArticuloComponent } from './views/articulo/articulo.component';
import { BuscarComponent } from './views/buscar/buscar.component';
import { CarritoComponent } from './views/carrito/carrito.component';
import { HomeComponent } from './views/home/home.component';
import { PerfilComponent } from './views/perfil/perfil.component';
import { RubroComponent } from './views/rubro/rubro.component';

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "carrito",
    component: CarritoComponent
  },
  {
    path: "categoria/:id",
    component: RubroComponent
  },
  {
    path: "articulo/:id",
    component: ArticuloComponent
  },
  {
    path: "perfil",
    component: PerfilComponent
  },
  {
    path: "buscar",
    component: BuscarComponent
  }
];
