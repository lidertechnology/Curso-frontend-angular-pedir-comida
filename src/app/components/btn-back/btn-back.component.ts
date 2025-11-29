import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-btn-back',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'btn-back.component.html',
  styleUrls: ['btn-back.component.scss']
})
export class BtnBackComponent {
  private location = inject(Location);

  goBack(): void {
    this.location.back();
  }
}
