import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';

@Component({
  templateUrl: './error.component.html'
})

export class ErrorComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string},
              @Inject(DOCUMENT) private _document: Document){

  }
  refreshPage() {
    this._document.defaultView.location.reload();
  }
}
