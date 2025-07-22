/*
    Copyright (c) 2025 gematik GmbH
    Licensed under the EUPL, Version 1.2 or - as soon they will be approved by the
    European Commission – subsequent versions of the EUPL (the "Licence").
    You may not use this work except in compliance with the Licence.
    You find a copy of the Licence in the "Licence" file or at
    https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
    Unless required by applicable law or agreed to in writing,
    software distributed under the Licence is distributed on an "AS IS" basis,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
    In case of changes by gematik find details in the "Readme" file.
    See the Licence for the specific language governing permissions and limitations under the Licence.
    *******
    For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
 */

import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, filter, from, lastValueFrom, Observable, of, tap } from 'rxjs';
import { HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SuperSpinnerComponent } from './super-spinner/super-spinner.component';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private matDialog = inject(MatDialog);

  startSpinner(title: string, progress$: Observable<number> = of(0), isTotalAvailable: boolean = false) {
    return this.matDialog.open(SuperSpinnerComponent, {
      height: '250px',
      width: '300px',
      disableClose: true,
      data: {
        title,
        mode: isTotalAvailable ? 'determinate' : 'indeterminate',
        progress$,
      },
    });
  }

  showProgress(post$: Observable<HttpEvent<Object>>, title: string, isTotalAvailable: boolean = false): Promise<HttpResponse<Object>> {
    const progressSubject = new BehaviorSubject(0);
    const dialogRef = this.startSpinner(title, progressSubject, isTotalAvailable);

    return lastValueFrom(
      post$.pipe(
        tap({
          next: event => this.handleProgress(event, progressSubject),
          error: () => dialogRef.close(),
          complete: () => dialogRef.close(),
        }),
        filter(event => event.type === HttpEventType.Response),
        map(event => event as HttpResponse<Object>)
      )
    );
  }

  private handleProgress(event: HttpEvent<Object>, progress$: BehaviorSubject<number>) {
    if (event.type === HttpEventType.UploadProgress || event.type === HttpEventType.DownloadProgress) {
      const progressEvent: HttpProgressEvent = event;
      if (progressEvent.total !== undefined) {
        const halfwayPercentage = Math.trunc((progressEvent.loaded / progressEvent.total) * 50);

        // the first half of the progress ist used for the request, the second half for the response
        const percentage = event.type === HttpEventType.UploadProgress ? halfwayPercentage : 50 + halfwayPercentage;
        progress$.next(percentage);
      }
    }
  }
}
