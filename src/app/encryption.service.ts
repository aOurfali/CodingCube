import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  sortIndices(toSort: string[]) {

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

  transpose(matrix: any[]) {
    let [row] = matrix;
    return row.map((value: any, column: any) => matrix.map(row => row[column]));
  }

}