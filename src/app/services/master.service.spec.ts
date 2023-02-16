import { TestBed } from "@angular/core/testing";
import { MasterService } from './master.service';
import { FakeValueService } from './value-fake.service';
import { ValueService } from './value.service';

/* servicios tipo mock o tipo fake */

describe('MasterService', () => {
  let masterService: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>

  beforeEach(() => {

    const spy = jasmine.createSpyObj('ValueService', ['getValue']);

    TestBed.configureTestingModule({
      providers: [
        MasterService,
        { provide: ValueService, useValue: spy }
      ]
    });
    masterService = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
  });

  it('should be create', () => {
    expect(masterService).toBeTruthy();
  })


  /* esta forma es muy poco utilizada por que se envia fake / mock */
  /* it('should return "my_value" from the real service', () => {
    //? aqui se esta creando una instancia manual (para este caso) pero como se esta haciendo un test de dependencias
    //? masterService en su constructor requiere la dependencia valueServices por eso se crea una instancia tambien de el
    const valueService = new ValueService();
    const masterService = new MasterService(valueService);
    expect(masterService.getValue()).toBe("my_value");
  }); */

  //! Los fake se utilizan con el objetivo de que en este archivo solo se tienen las pruebas de master y a el no le interesa si valueService funciono por que tiene sus pruebas
  //! propias, pero master solo necesita que valueServices(este caso FakeValueServices) ejecute

  //! metodo deficiente por que hay que mantener los cambios del servicio real en el fake

  //? forma con fak / mock  (forma 1 - MENOS RECOMENDADA - pasando un servicio)
/*   it('should return "fake value" from the fake service', () => {
    //? al tener en el contructor de master la dependencia de valueservice lo que se le pasa es fakeService forzando el tipo
    const fakeValueService = new FakeValueService();
    const masterService = new MasterService(fakeValueService as unknown as ValueService);
    expect(masterService.getValue()).toBe("fake value");
  }); */

  //? forma con fak / mock  (forma 2 - MAS RECOMENDADA - pasando un objeto)
/*   it('should return "fake value" from the fake object', () => {
    const fake = { getValue: () => 'fake from obj' };
    const masterService = new MasterService(fake as ValueService);
    expect(masterService.getValue()).toBe("fake from obj");
  }); */



  //? Prueba usando spice (espias): es una prueba mas profesional frente al tema anterior, con esta no solo se evidencia si se la respuesta del servicio fue la correcta
  //? sino que tambien si el metodo se ejecuto

  it('should call to getValue from ValueService', () => {

    //* spy config = se crea un mock que se puede espiar
    /* const valueServiceSpy = jasmine.createSpyObj('ValueService', ['getValue']); */


    valueServiceSpy.getValue.and.returnValue('fake value');
    /* const masterService = new MasterService(valueServiceSpy); */

    //* aqui se prueba el retorno del metodo
    expect(masterService.getValue()).toBe("fake value");

    //* aqui se prueba si el metodo (getValue) fue llamado
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    //* probando cuantas veces fue llamado
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });

});
