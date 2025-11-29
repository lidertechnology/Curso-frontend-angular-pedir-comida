import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { ConfigService } from './core/services/config.service';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent,TabsComponent, RouterModule],
})
export class AppComponent implements OnInit {
  title = 'pedir-comida';

  configService = inject(ConfigService);
  cartService = inject(CartService);

  async ngOnInit() {
    await this.configService.loadConfig();
    this.cartService.initCart();
  }
}
