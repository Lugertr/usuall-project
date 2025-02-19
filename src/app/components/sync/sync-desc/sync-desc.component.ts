import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-sync-desc',
  imports: [MatCardModule, MatListModule, MatButtonModule, MatIconModule, MatExpansionModule],
  templateUrl: './sync-desc.component.html',
  styleUrls: ['./sync-desc.component.scss'],
})
export class SyncDescComponent {}
