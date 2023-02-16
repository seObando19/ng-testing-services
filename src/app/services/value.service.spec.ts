import { TestBed } from "@angular/core/testing";

import { ValueService } from './value.service';

//? cada it es 1 escenario de prueba
//? es buena practica hacer una instancia para cada prueba tener un ambiente sin modificaciones (se utiliza beforeEach)

describe('ValueService', () => {
  let service: ValueService;

  //* antes de cada prueba lo que este aqui se ejecuta
  beforeEach(() =>{
    TestBed.configureTestingModule({
      providers: [ ValueService ]
    });

    service = TestBed.inject(ValueService);

    //tener instancia totalmente nueva para cada it //*(al configurar el provider de tested no es necesario crear instancia manual)
    /* service = new ValueService(); */
  })

  //tener la instancia del servicio si se creo correctamente
  it('should be create', () => {
    expect(service).toBeTruthy();
  });

  describe('Tests for getValue', () => {
    it('should return my_value', () =>{
      expect(service.getValue()).toBe('my_value')
    });
  });

  describe('Tests for setValue', () => {
    it('should change value', () =>{
      expect(service.getValue()).toBe('my_value');
      service.setValue('other_value');
      expect(service.getValue()).toBe('other_value');
    });
  });

  // las pruebas se rompen un poco por que se espera de que las pruebas sean de forma sincrona
  //? para estos casos establecer donefn => normalmente la prueba termina en la ultima linea pero con donefn se especifica donde finaliza
  describe('Tests for getPromiseValue', () => {
    it('should return promise value from promise with then', (donefn) =>{
      service.getPromiseValue()
      .then((value) =>{
        //assert
        expect(value).toBe('promise value');
        donefn();
      })
    });

    it('should return promise value from promise using async', async () =>{
      const rta = await service.getPromiseValue();
      expect(rta).toBe('promise value');
    });
  });

  describe('Test for getObservableValue', () => {
    it('should return observable value', (donefn) => {
      service.getObservableValue().subscribe((value) =>{
        expect(value).toBe('observable value')
        donefn();
      })
    })

  })

});
