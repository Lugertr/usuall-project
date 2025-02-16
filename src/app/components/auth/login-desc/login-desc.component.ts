import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-login-desc',
  imports: [MatCardModule, MatListModule, MatButtonModule, MatIconModule, MatExpansionModule],
  templateUrl: './login-desc.component.html',
  styleUrls: ['./login-desc.component.scss'],
})
export class LoginDescComponent {}
