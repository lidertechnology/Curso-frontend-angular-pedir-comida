import { Component, effect, inject, signal } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BtnBackComponent } from '../btn-back/btn-back.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterModule,CommonModule, BtnBackComponent]
})
export class HeaderComponent {

  headerService = inject(HeaderService);
  claseAplicada = signal("");
  tituloMostrado = signal("Hola");

  esconderTitulo = effect(()=> {
    if(this.headerService.titulo()){
      this.claseAplicada.set("fade-out");
    }
  },{allowSignalWrites:true});

  mostrarTituloNuevo(e:AnimationEvent){
    if(e.animationName.includes("fade-out")){
      this.tituloMostrado.set(this.headerService.titulo());
      this.claseAplicada.set("fade-in");
      setTimeout(()=> this.claseAplicada.set(""),250)
    }
  }

}
