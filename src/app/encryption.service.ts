import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  sortIndices(toSort: string[]): number[] {

    let sortWithIndices = new Array(toSort.length);
    let justIndices = new Array(toSort.length);
    for (var i = 0; i < toSort.length; i++) {
      sortWithIndices[i] = [toSort[i], i];
    }
    sortWithIndices.sort();
    for (var i = 0; i < toSort.length; i++) {
      justIndices[i] = sortWithIndices[i][1];
    }
    return justIndices;
  }

}