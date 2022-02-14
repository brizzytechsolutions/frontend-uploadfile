import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Image } from '../models/image';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  myUrl = environment.baseUrl;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    public http: HttpClient
  ) { }

  getAllImg(): Observable<any>{
    return this.http.get(this.myUrl);
  }

  createFiles(name: string, imgPoster: File, ): Observable<any> {
    const formData: any = new FormData();
    formData.append('name', name);
    formData.append('img', imgPoster);
    // formData.append('size', size);
    // formData.append('mimeType', mimeType);
    // formData.append('dateCreated', dateCreated);
    return this.http.post<Image>(this.myUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
