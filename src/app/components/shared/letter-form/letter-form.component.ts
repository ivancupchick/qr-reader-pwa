import { Component, OnInit } from '@angular/core';
import { Letter } from 'src/app/services/dbletters.service';

@Component({
  selector: 'app-letter-form',
  templateUrl: './letter-form.component.html',
  styleUrls: ['./letter-form.component.sass']
})
export class LetterFormComponent implements OnInit {
  letter: Letter;

  constructor() { }

  ngOnInit() {
    this.letter = {} as Letter;
  }

}
