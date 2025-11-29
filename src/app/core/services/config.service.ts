import { Injectable, WritableSignal, signal } from '@angular/core';
import { Config } from '../interfaces/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  configuracion:WritableSignal<Config> = signal({
    costoEnvio: 0,
    diasVencimientoCarrito: 100,
    numeroAdmin: ''
  })

  loadConfig(): Promise<void> {
    return fetch("assets/data/config.json") // RUTA CORREGIDA
      .then(res => {
        if (!res.ok) {
          // Si la respuesta no es OK (ej. 404 Not Found), lanzamos un error
          throw new Error(`Error al cargar la configuración: ${res.statusText}`);
        }
        return res.json();
      })
      .then(resJson => {
        this.configuracion.set(resJson);
      })
      .catch(error => {
        // Capturamos cualquier error de red o de parseo
        console.error("No se pudo cargar el archivo de configuración. Se usarán los valores por defecto.", error);
        // Opcional: podemos dejar que la app continúe con valores por defecto
        // O lanzar el error para detenerla si la config es crítica.
        // Por ahora, lo mostraremos en consola y continuaremos.
      });
  }
}
