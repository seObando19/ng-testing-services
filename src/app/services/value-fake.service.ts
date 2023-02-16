export class FakeValueService {

  private value = 'fake value';

  constructor() { }

  getValue(){
    return this.value;
  }

  setValue(value:string){}

  getPromiseValue(){
    return Promise.resolve('fake promise value');
  }
}
