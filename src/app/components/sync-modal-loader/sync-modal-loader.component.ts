import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, SYNC_STATUS } from '@core/auth/auth.service';
import { DestroyService } from '@core/services/destroy.service';
import { InformerService } from '@core/services/informer.service';
import { takeUntil, takeWhile } from 'rxjs';

@Component({
  selector: 'app-sync-modal-loader',
  imports: [MatProgressSpinnerModule, MatButtonModule, FormsModule],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sync-modal-loader.component.html',
  styleUrls: ['./sync-modal-loader.component.scss'],
})
export class SyncModalLoaderComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly destroy$ = inject(DestroyService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly informer = inject(InformerService);
  private readonly dialogRef = inject(MatDialogRef<SyncModalLoaderComponent>);
  progress: number = null;
  private isDialogClosed = false;

  ngOnInit(): void {
    this.authService
      .sync()
      .pipe(
        takeWhile(progress => progress < SYNC_STATUS['Synchronization process completed'], true),
        takeUntil(this.destroy$),
      )
      .subscribe({
        complete: () => {
          if (!this.isDialogClosed) {
            this.progress = 100;
            this.informer.success('Синхронизация успешна');
            this.closeModal();
          }
        },
        next: ([res, status]) => {
          this.progress = status;
          this.cdr.markForCheck();
        },
        error: err => {
          this.informer.error(err, 'Ошибка синхронизации');
          this.closeModal();
        },
      });
  }

  closeModal(): void {
    this.isDialogClosed = true;
    this.dialogRef.close();
  }
}
