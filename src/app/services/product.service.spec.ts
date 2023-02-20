import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ProductsService } from "./product.service";
import { Product, CreateProductDTO, UpdateProductDTO } from "../models/product.model";
import { generateManyProducts, generateOneProduct } from "../models/produc.mock";
import { environment } from "../../environments/environment";
import { HttpStatusCode, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "../interceptors/token.interceptor";
import { TokenService } from "./token.service";


describe('ProductService', () => {
  let productService: ProductsService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi:true
        }
      ]
    });
    productService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  })

  it('should be create', () => {
    expect(productService).toBeTruthy();
  })

  describe('Test for getAllSimple', () => {

    it('should return product list', (doneFn) => {
      //arranque
      const mockData: Product[] = generateManyProducts(2);
      //act
      productService.getAllSimple()
      .subscribe((data)=> {
        //assert
        expect(data.length).toEqual(mockData.length);
        expect(data).toEqual(mockData);
        doneFn();
      });

      //? http config
      // esto se realiza con el objetivo de en vez de ir a realizar una peticion al api
      // tome en realidad lo que se le pasa acontinuacion

      // esto se hace para evitar que al realizar pruebas no te bloqueen el api
      // por todas las peticiones generadas
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      //metodo para montar el mockData
      req.flush(mockData);
    });
  });

  //? Pruebas para verbos HTTP

  describe('Test for getAll', () => {

    //! prueba normal
    it('should return a product list', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);
      productService.getAll()
      .subscribe((data)=> {
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      //httpController.verify();
    })

    //! Happy path (valores correctos)
    it('should return  product list with taxes', (doneFn) => {
      //arranque aqui se necesita data en especifico para validar si los calculos del impuesto(taxes) esta bien
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, // 100 * .19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, // 200 * .19 = 38
        }
      ]
      productService.getAll()
      .subscribe((data)=> {
        expect(data.length).toEqual(mockData.length);
        expect(data[0].taxes).toEqual(19),
        expect(data[1].taxes).toEqual(38)
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    })

    //!Unhappy path (cambiando valores al enviar)
    it('should return  product list with taxes', (doneFn) => {
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, // 100 * .19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, // 200 * .19 = 38
        },
        {
          ...generateOneProduct(),
          price: 0, // 0 * .19 = 0
        },
        {
          ...generateOneProduct(),
          price: -100, // 0
        }
      ]
      productService.getAll()
      .subscribe((data)=> {
        expect(data.length).toEqual(mockData.length);
        expect(data[0].taxes).toEqual(19),
        expect(data[1].taxes).toEqual(38),
        expect(data[2].taxes).toEqual(0),
        expect(data[3].taxes).toEqual(0),
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    })

    //! usando query params
    it('should send query params limit 10 and offset 3', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);
      const limit = 10;
      const offset = 3;
      productService.getAll(limit, offset)
      .subscribe((data)=> {
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      //aqui ya sabiendo que mando en la url para la peticion a continuacion puedo capturar los params para pruebas
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    })

    //! enviando un offset 0
    it('should send offset 0', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);
      const limit = 10;
      const offset = 0;
      productService.getAll(limit, offset)
      .subscribe((data)=> {
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      //aqui ya sabiendo que mando en la url para la peticion a continuacion puedo capturar los params para pruebas
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    })

  });

  describe('Test for create', () => {

    it('should return new product', (doneFn) => {
      //arranque
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'new Product',
        price: 100,
        images: ['img'],
        description: 'bla bla bla',
        categoryId: 12
      }

      //act
      productService.create({...dto})
      .subscribe((data) => {
        //assert
        expect(data).toEqual(mockData);
        doneFn();
      })

      //config http
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
      //httpController.verify();
    })

  })

  describe('Test for update', () => {

    it('should return updated product', (doneFn) => {
      const id = "123";
      const mockData = generateOneProduct();
      const dto:UpdateProductDTO = {
        title: 'new Product'
      }

      productService.update(id, {...dto}).subscribe((data) => {
        expect(data).toEqual(mockData);
        doneFn();
      })

      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush(mockData);
    })


  })

  describe('Test for delete', ()=> {
    it('should deleted product', (doneFn) => {
      /* arrange */
      const id = "123";
      const mockData = true;

      /* act */
      productService.delete(id)
      .subscribe((data) => {
        /* assert */
        expect(data).toEqual(mockData);
        doneFn();
      })

      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData);
    })
  })

  //! aprendiendo a hacer prueba a los errores
  describe('Test for getOne', () => {

    //* Happy Path
    it('should return a product', (doneFn) => {
      const id = "123";
      const mockData = generateOneProduct();

      productService.getOne(id)
      .subscribe((data) => {
        expect(data).toEqual(mockData);
        doneFn();
      })

      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockData);
    });

    //* Unhappy Path
    it('should return ro right message when status code is 404', (doneFn) => {
      const id = "123";
      const msgError = "404 message";
      const mockEror = {
        status: HttpStatusCode.NotFound,
        statusText: msgError
      }

      //? forma nueva NOTA= esta forma es si en package.json se utiliza rxjs ~7.5.0
      productService.getOne(id)
      .subscribe({
        error: (error) => {
          //assert
          expect(error).toEqual('El producto no existe');
          doneFn();
        }
      })

      //* como la prueba es para probar error en el subcribe se envia null
      //* version que va quedar obsoleta pero que funciona

      //productService.getOne(id)
      //.subscribe(null, () => {
      //  expect(error).toEqual('El producto no existe');
      //  doneFn();
      //})

      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockEror);
    });

    it('should return to right message when status code is 409', (doneFn) => {
      const product_id = "1";
      const msgError = "409 message";
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError
      }

      productService.getOne(product_id)
      .subscribe({
        error: (error) => {
          expect(error).toEqual('Algo esta fallando en el server');
          doneFn();
        }
      })

      const url = `${environment.API_URL}/api/v1/products/${product_id}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    })

    it('should return to right message when status code is 401', (doneFn) => {
      const product_id = "1";
      const msgError = "401 message";
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: msgError
      }

      productService.getOne(product_id)
      .subscribe({
        error: (error) => {
          expect(error).toEqual('No estas permitido');
          doneFn();
        }
      })

      const url = `${environment.API_URL}/api/v1/products/${product_id}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    })

    it('should return to right message when status code is 500', (doneFn) => {
      const product_id = "1";
      const msgError = "500 message";
      const mockError = {
        status: HttpStatusCode.InternalServerError,
        statusText: msgError
      }

      productService.getOne(product_id)
      .subscribe({
        error: (error) => {
          expect(error).toEqual('Ups algo salio mal');
          doneFn();
        }
      })

      const url = `${environment.API_URL}/api/v1/products/${product_id}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    })

  })

  //! aprendiendo a hacer pruebas con interceptores (NUEVA FORMA CREAR SPY)
  describe('Test for getAllSimple with interceptor', () => {

    it('should return product list and el req contar con el header', (doneFn) => {
      //arranque
      const mockData: Product[] = generateManyProducts(2);

      //? quiero usar el servicio real pero solo una parte del servicio
      spyOn(tokenService, 'getToken').and.returnValue('123');

      //act
      productService.getAllSimple()
      .subscribe((data)=> {
        //assert
        expect(data.length).toEqual(mockData.length);
        expect(data).toEqual(mockData);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);

      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual(`Bearer 123`);

      req.flush(mockData);
    });
  });

})
