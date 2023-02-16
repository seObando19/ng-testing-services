import { Calculator } from "./calculator";

//* aqui van dentro todas nuestras pruebas
describe('Test for Calculator', ()=> {

  //* estructura de una prueba donde param1 describe que hace param2- arrow function con la prueba
  it('#multiply should return a nine', ()=>{
    /// Mantra de las AAA

    //? A - Arrange => lo que se necesita para correr la prueba
    const calculator = new Calculator();

    //? A - Act => fase de ejecutar el codigo que se quiere probar
    const rta = calculator.multiply(3,3);

    //? A - Assert => resuelvo mi hipotesis (el como debe actuar)
    expect(rta).toEqual(9);
  })

  //? Enclapsulando pruebas para un servicio en especifico (una buena forma)
  describe('Test for multiply', () => {
    it('#multiply should return a four', ()=>{
      //? A - Arrange
      const calculator = new Calculator();
      //? A - Act
      const rta = calculator.multiply(1,4);
      //? A - Assert
      expect(rta).toEqual(4);
    })

    it('#multiply should return a nine', ()=>{
      //? A - Arrange
      const calculator = new Calculator();
      //? A - Act
      const rta = calculator.multiply(3,3);
      //? A - Assert
      expect(rta).toEqual(9);
    })
  });

  describe('Test for divide', () => {
    it('#divide should return a some numbers', ()=>{
      //? A - Arrange
      const calculator = new Calculator();
      //? A - combinar Act y assert
      expect(calculator.divide(6,3)).toEqual(2);
      expect(calculator.divide(5,2)).toEqual(2.5);
    })

    it('#divide for zero', ()=>{
      //? A - Arrange
      const calculator = new Calculator();
      //? A - combinar Act y assert
      expect(calculator.divide(6,0)).toBeNull();
      expect(calculator.divide(5,0)).toBeNull();
    })
  });


  it('Test matchers', ()=>{
    const name = 'sebastian';
    let name2;

    //validar si una variable esta definida
    expect(name).toBeDefined();

    //validar si una variable no esta definida
    expect(name2).toBeUndefined();

    //validar valores logicos
    expect(1 + 3 === 4).toBeTruthy(); // 4
    expect(1 + 1 === 3).toBeFalsy();

    //mayor o menor un valor
    expect(5).toBeLessThan(10);
    expect(20).toBeGreaterThan(10);

    //expresion regular
    expect('123456').toMatch(/123/);

    //validar si un valor esta dentro del array
    expect(['apples', 'oranges', 'pears']).toContain('oranges');

  })
});
