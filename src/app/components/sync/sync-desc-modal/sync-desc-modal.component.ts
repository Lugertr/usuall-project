import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SyncDescComponent } from '../sync-desc/sync-desc.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sync-desc-modal',
  imports: [SyncDescComponent, MatButtonModule, MatIconModule],
  templateUrl: './sync-desc-modal.component.html',
  styleUrls: ['./sync-desc-modal.component.scss'],
})
export class SyncDescModalComponent {
  private readonly dialogRef = inject(MatDialogRef<SyncDescModalComponent>);

  startSync(): void {
    this.dialogRef.close(true);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
