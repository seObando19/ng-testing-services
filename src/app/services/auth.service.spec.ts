import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ProductsService } from "./product.service";
import { TokenService } from "./token.service";
import { AuthService } from "./auth.service";
import { Auth } from "../models/auth.model";
import { environment } from "../../environments/environment";


describe('AuthService', () => {
  let authService: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        AuthService,
        TokenService
      ]
    });
    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  })

  it('should be create', () => {
    expect(authService).toBeTruthy();
  })

  describe('Test for login', () => {

    //? test para ver la respuesta del servicio
    it('should return a token', (doneFn)=> {
      //arranque
      const email = "sebas@getnad.com";
      const password = "1221221";
      const mockData: Auth = {
        access_token: '1233123'
      };

      //act
      authService.login(email, password)
      .subscribe((data)=> {
        //assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    })

    //? test verificar si esta llamando servicio del guardar el token
    it('should call to saveToken', (doneFn)=> {
      //arranque
      const email = "sebas@getnad.com";
      const password = "1221221";
      const mockData: Auth = {
        access_token: '1233123'
      };

      //no llamar a la funcion real pero si espiar (de esta forma por que la funcion no retorna nada)
      spyOn(tokenService, 'saveToken').and.callThrough();

      //act
      authService.login(email, password)
      .subscribe((data)=> {
        //assert
        expect(data).toEqual(mockData);
        expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
        expect(tokenService.saveToken).toHaveBeenCalledOnceWith('1233123');
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    })

  })

})
