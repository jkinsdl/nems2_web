import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1c2Vycy8xIiwiZXhwIjoxNjc1NDA1OTIyLCJpYXQiOjE2NzUxNDY3MjIsImlzcyI6InN1cmVkYXRhbGFiLmNvbSIsIkF1dGgiOnsiaWQiOjEsImF1dGhvcml0eV9pZCI6InJvb3QifX0.NMNOIlueJwma8KM2pocLgjwuTsfZ1X9nFZ-LwmAfnrc; HttpOnly; SameSite=Lax"

    const authReq = req.clone({
      //headers: req.headers.set('access-token', token)
    });

    return next.handle(authReq)
  }
}
