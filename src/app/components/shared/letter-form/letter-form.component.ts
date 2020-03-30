import { Component, OnInit, Input } from '@angular/core';
import { Letter, LetterStatus, TypeOfTown as TownType, StreetType } from 'src/app/services/dbletters.service';

@Component({
  selector: 'app-letter-form',
  templateUrl: './letter-form.component.html',
  styleUrls: ['./letter-form.component.sass']
})
export class LetterFormComponent implements OnInit {
  @Input() letter: Letter;

  constructor() { }

  ngOnInit() {
    this.letter = {
      id: null,
      hash: this.getTestHash(16),
      status: LetterStatus.withoutStatus,
      isMejdunarond: '',
      receiverAddress: {
        komu: {
          name: '',
          surname: '',
          otchestvo: ''
        },
        kuda: {
          streetName: '',
          streetType: StreetType.ulica,
          numberOfFlat: '',
          numberOfHouse: '',
          numberOfKorpus: ''
        },
        index: '',
        nasPunktName: {
          oblast: '', // область
          region: '', // район
          townName: '', // город (название населеного пункта)
          typeOfTown: TownType.city,
          country: ''
        }
      },
      otpravitelAddress: {
        otKogo: {
          name: '',
          surname: '',
          otchestvo: ''
        },
        adress: {
          streetName: '',
          streetType: StreetType.ulica,
          numberOfFlat: '',
          numberOfHouse: '',
          numberOfKorpus: '',
          oblast: '', // область
          region: '', // район
          townName: '', // город (название населеного пункта)
          typeOfTown: TownType.city,
          country: ''
        }
      },
      dateAndTimeOfStartWay: (new Date()).getMilliseconds(),
      history: ''
    };
  }

  getTestHash(length) {
    let result = '';
    const characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
