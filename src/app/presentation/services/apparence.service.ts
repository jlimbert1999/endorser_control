import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, inject } from '@angular/core';
import { LoaderComponent } from '../components/loader/loader.component';

@Injectable({
  providedIn: 'root',
})
export class ApparenceService {
  private overlay = inject(Overlay);
  overlayRef = this.overlay.create({
    positionStrategy: this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically(),
    hasBackdrop: true,
  });

  showLoader() {
    this.overlayRef.attach(new ComponentPortal(LoaderComponent));
  }

  hideLoader() {
    this.overlayRef.detach();
  }
  constructor() {}
}
