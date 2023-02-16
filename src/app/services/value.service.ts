import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValueService {

  private value = 'my_value';

  constructor() { }

  getValue(){
    return this.value;
  }

  setValue(value:string){
    this.value = value;
  }

  getPromiseValue(){
    return Promise.resolve('promise value');
  }

  getObservableValue(){
    //traer un observable con un valor definido => of()
    return of('observable value')
  }
}
