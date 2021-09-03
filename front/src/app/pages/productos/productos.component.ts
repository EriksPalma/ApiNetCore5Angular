import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Producto } from 'src/app/interfaces/producto';
import { ProductosServiceService } from '../../services/productos-service.service';
import { EstadosService } from '../../services/estados.service';
import { combineLatest, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Estado } from '../../interfaces/estado';
import { ProductoEstado } from '../../interfaces/productoEstado';
import { ProductoEstadoService } from '../../services/producto-estado.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit, AfterViewInit {
  formulario: FormGroup;
  formularioModificar: FormGroup;
  objetoProducto: Producto = {};
  objetoEstado: Estado = {};
  objetoProductoEstado: ProductoEstado = {};
  objetoModificar: ProductoEstado;
  columnas: string[] = ['codigo', 'nombre', 'cantidad', 'estado', 'acciones'];
  fuenteDatos: ProductoEstado[];
  dataSource = new MatTableDataSource<ProductoEstado>([]);
  tabIndex: number;
  estadoValido = true;

  // lista de Estados
  estados: Estado[];
  estadosFiltrados: Observable<Estado[]>;
  estadosFiltradosCrear: Observable<Estado[]>;
  // lista de prodcutos
  productos: Producto[];
  productosFiltrados: Observable<Producto[]>;

  // Controles de consulta
  controlEstadoConsulta = new FormControl();

  // Controles formulario Crear
  controlId = new FormControl();
  controlCodigo = new FormControl('', Validators.required);
  controlNombre = new FormControl('', Validators.required);
  controlIdEstado = new FormControl();
  controlCantidad = new FormControl('', Validators.required);

  // Controles formulario Modificar
  controlProducto = new FormControl(
    { value: '', disabled: true },
    Validators.required
  );
  controlCantidadMod = new FormControl('', Validators.required);
  controlIdEstadoMod = new FormControl(
    { value: '', disabled: true },
    Validators.required
  );

  // valores Consulta
  estadoConsulta: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Contructor del Componente
   *
   * @param fb - Configulación del formulario
   * @param productosService - Servico para el menejo de productos
   * @param estadosService - Servicio para el manejo de estados
   * @param productoEstadoService - Servicio para el manejo de cantidad de prodcutos por estado
   * * @param dialogs - Permite el manejo de ventanas modales
   */
  constructor(
    private fb: FormBuilder,
    private productosService: ProductosServiceService,
    private estadosService: EstadosService,
    private productoEstadoService: ProductoEstadoService
  ) {}

  ngOnInit(): void {
    this.inicio();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  inicio(): void {
    this.iniciarControles();
    this.iniciarFormulario();
    this.cargarListas();
  }

  cargarListas(): void {
    combineLatest([
      this.estadosService.obtenerEstados(),
      this.productosService.obtenerProductos(),
    ]).subscribe(([estados, productos]) => {
      // Estados
      this.estados = estados;
      this.estadosFiltrados = this.controlEstadoConsulta.valueChanges.pipe(
        startWith(''),
        map((valor) => this._opcionesFiltradas(valor, 'estados', 'nombre'))
      );
      this.estadosFiltradosCrear = this.controlIdEstado.valueChanges.pipe(
        startWith(''),
        map((valor) => this._opcionesFiltradas(valor, 'estados', 'nombre'))
      );
      // Productos
      this.productos = productos;
      this.productosFiltrados = this.controlEstadoConsulta.valueChanges.pipe(
        startWith(''),
        map((valor) => this._opcionesFiltradas(valor, 'productos', 'nombre'))
      );

      this.consultarProductos();
    });
  }

  /**
   * Metodo que filtra dependiedo de la entrada en el input que contiene el autocomplete que lo usa
   * @param valor - cadena de caracteres por la que se va a filtrar
   * @param dato lista con todas las opciones
   * @param propiedad propiedad que se va retornar
   * @returns valor de la propiedad indicada
   */
  private _opcionesFiltradas(
    valor: string,
    dato: string,
    propiedad: string
  ): any[] {
    const filterValue = valor.toLowerCase();
    return this[dato].filter((option) =>
      option[propiedad].toLowerCase().includes(filterValue)
    );
  }

  iniciarFormulario(): void {
    this.formulario = this.fb.group({
      id: this.controlId,
      codigo: this.controlCodigo,
      nombre: this.controlNombre,
      cantidad: this.controlCantidad,
      estado: this.controlIdEstado,
    });

    this.formularioModificar = this.fb.group({
      idProducto: this.controlProducto,
      cantidadM: this.controlCantidadMod,
      idEstado: this.controlIdEstadoMod,
    });
  }

  iniciarControles(): void {
    this.controlEstadoConsulta.valueChanges.subscribe((resp) => {
      this.estadoConsulta = resp;
    });

    // Controles formulario
    this.controlId.valueChanges.subscribe((resp) => {
      this.objetoProducto.id = resp;
      this.objetoProductoEstado.idProducto = resp;
    });

    this.controlCodigo.valueChanges.subscribe((resp) => {
      this.objetoProducto.codigo = resp;
    });

    this.controlNombre.valueChanges.subscribe((resp) => {
      this.objetoProducto.nombre = resp;
    });

    this.controlIdEstado.valueChanges.subscribe((resp) => {
      this.objetoProductoEstado.idEstado = resp;
    });

    this.controlCantidad.valueChanges.subscribe((resp) => {
      this.objetoProductoEstado.cantidad = resp;
    });

    // Control formulario modificar
    this.controlCantidadMod.valueChanges.subscribe((resp) => {
      this.objetoModificar.cantidad = resp;
    });
  }

  validarParametrosConsulta(): boolean {
    let valido = true;
    let dato: any;

    // Valida el valor del campo estadoConsulta
    if (this.controlEstadoConsulta.value) {
      dato = this.estados.find(
        (e) => e.nombre === this.controlEstadoConsulta.value
      );
      if (dato) {
        this.estadoConsulta = dato.id;
      } else {
        valido = false;
      }
    }

    return valido;
  }

  setTabIndex(id: number): void {
    this.tabIndex = 2;

    this.objetoModificar = this.fuenteDatos.find((e) => e.id === id);

    // Controles formulario Modificar
    this.controlProducto.setValue(this.objetoModificar.producto.nombre);
    this.controlCantidadMod.setValue(this.objetoModificar.cantidad);
    this.controlIdEstadoMod.setValue(this.objetoModificar.estado.nombre);
  }

  consultarProductos(): void {
    if (this.validarParametrosConsulta()) {
      this.productoEstadoService
        .obtenerProductoEstado(this.estadoConsulta ? this.estadoConsulta : '')
        .subscribe((resp) => {
          resp.forEach((pe) => {
            pe.producto = this.productos.find((p) => p.id === pe.idProducto);
            pe.estado = this.estados.find((e) => e.id === pe.idEstado);
          });

          this.fuenteDatos = resp;
          this.dataSource.data = this.fuenteDatos;
        });
    }
  }

  /*validarDatosGuardar(): void {
    let valido = true;
    let dato: any;

    // Valida el valor del campo estadoConsulta
    if (this.controlIdEstado.value) {
      dato = this.estados.find((e) => e.nombre === this.controlIdEstado.value);
      if (dato) {
        this.objetoProductoEstado.idEstado = dato.id;
        this.estadoValido = true;
      } else {
        this.estadoValido = false;
        valido = false;
      }
    }

    if (valido) {
      this.guardarEntidad();
    }
  }*/

  guardarEntidad(): void {

    this.productosService
      .crear(this.objetoProducto)
      .subscribe((producto: Producto) => {
        this.objetoProductoEstado.idProducto = producto.id;

        this.estados.forEach((e, index) => {
          this.objetoProductoEstado.idEstado = e.id;

          if (index > 0) {
            this.objetoProductoEstado.cantidad = 0;
          }

          this.productoEstadoService
            .crear(this.objetoProductoEstado)
            .subscribe((productoEstado: ProductoEstado) => {
              if (index === this.estados.length - 1) {
                this.tabIndex = 0;
                this.cargarListas();
                this.limpiarFormularioCrear();
              }
            });
        });
      });
  }

  limpiarFormularioCrear(): void {
    this.controlId.setValue('');
    this.controlCodigo.setValue('');
    this.controlNombre.setValue('');
    this.controlIdEstado.setValue('');
    this.controlCantidad.setValue('');

    this.objetoProducto = {};
    this.objetoProductoEstado = {};
  }

  actualizarEntidad(): void {
    this.productoEstadoService
      .actualizar(this.objetoModificar)
      .subscribe((resp) => {
        this.limpiar();
        this.tabIndex = 0;
        this.cargarListas();
      });

  }

  limpiar(): void {
    this.controlCantidadMod.setValue('');

    this.objetoModificar = {};
  }

  /**
   * Objetos para el manejo de los controles
   */
  get nombre(): AbstractControl {
    return this.formulario.get('nombre');
  }

  get codigo(): AbstractControl {
    return this.formulario.get('codigo');
  }

  get estado(): AbstractControl {
    return this.formulario.get('estado');
  }

  get cantidad(): AbstractControl {
    return this.formulario.get('cantidad');
  }

  get cantidadM(): AbstractControl {
    return this.formularioModificar.get('cantidadM');
  }
}
