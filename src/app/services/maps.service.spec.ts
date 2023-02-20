import { TestBed } from '@angular/core/testing';

import { MapsService } from './maps.service';

describe('MapsService', () => {
  let mapsService: MapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ MapsService ]
    });
    mapsService = TestBed.inject(MapsService);
  });

  it('should be created', () => {
    expect(mapsService).toBeTruthy();
  });

  describe('Test for getCurrentPosition', () => {

    it('should save the center', ()=> {
      //!arrange
      //? se realiza de esta manera por que:
      //* 1- esta funcion no viene inyectada
      //* 2- tiene un callback
      //? callFake es una herramienta de mocking que reemplaza la funcion getCurrentPosition
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((successFn) => {
        //* emular la respuesta
        const mockGeolocation = {
          coords: {
            accuracy: 0,
            altitude: 0,
            altitudeAccuracy: 0,
            heading: 0,
            latitude: 1000,
            longitude: 2000,
            speed: 0
          },
          timestamp: 0,
        }
        //* ejecutar el callback
        successFn(mockGeolocation)
      });

      //! act
      mapsService.getCurrentPosition();

      //! assert
      expect(mapsService.center.lat).toEqual(1000);
      expect(mapsService.center.lng).toEqual(2000);
    })

  })

});
