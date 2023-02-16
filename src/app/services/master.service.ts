import { Injectable } from '@angular/core';
import { ValueService } from "./value.service";

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  //? Testing para la inyeccion de dependencias

  constructor(
    private valueService: ValueService
  ) { }

  getValue(){
    // el spyce que verifica si se llamo el metodo evita que yo devuelva un valor sin llamar a su metodo
    return this.valueService.getValue();
  }
}
