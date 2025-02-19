import { Injectable } from '@angular/core';

@Injectable()
export class NavBarNotificationService {
  private readonly lastVisitKey = 'lastVisit';

  hasVisitedInLast24Hours(): boolean {
    const lastVisit = localStorage.getItem(this.lastVisitKey);
    if (!lastVisit) {
      return false;
    }

    const lastVisitDate = new Date(lastVisit);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - lastVisitDate.getTime();

    return timeDifference < 24 * 60 * 60 * 1000;
  }

  updateVisitTime(): void {
    localStorage.setItem(this.lastVisitKey, new Date().toString());
  }
}
