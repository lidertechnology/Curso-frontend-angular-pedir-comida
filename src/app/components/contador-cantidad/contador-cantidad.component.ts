import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-contador-cantidad',
  templateUrl: './contador-cantidad.component.html',
  styleUrls: ['./contador-cantidad.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ContadorCantidadComponent {

  @Input() cantidadInicial: number = 1;
  @Output() cantidadCambiada = new EventEmitter<number>();
  cantidad = signal(1);

  ngOnInit(): void {
    this.cantidad.set(this.cantidadInicial);
  }

  sumar(){
    this.cantidad.update(value => value + 1);
    this.cantidadCambiada.emit(this.cantidad());
  }

  restar(){
    if(this.cantidad() > 1){
      this.cantidad.update(value => value - 1);
      this.cantidadCambiada.emit(this.cantidad());
    }
  }

}
