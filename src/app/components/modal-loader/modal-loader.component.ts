import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '@core/auth/auth.service';
import { DestroyService } from '@core/services/destroy.service';
import { InformerService } from '@core/services/informer.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-modal-loader',
  imports: [MatProgressSpinnerModule, MatButtonModule, FormsModule],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal-loader.component.html',
  styleUrls: ['./modal-loader.component.scss'],
})
export class ModalLoaderComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly destroy$ = inject(DestroyService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly informer = inject(InformerService);
  private readonly dialogRef = inject(MatDialogRef<ModalLoaderComponent>);
  progress: number = null;

  ngOnInit(): void {
    this.authService
      .sync()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.informer.success('Синхронизация успешна');
          this.closeModal();
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
    //this.dialogRef.close();
  }
}
