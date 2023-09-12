import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PersonaJuridicaService } from 'src/app/_service/persona-juridica.service';
import {
  FormBuilder,
  FormControl,
  FormGroup, 
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';



import { RequestPersonaJur } from 'src/app/_model/persona_juridica';
import { LoginService } from 'src/app/_service/login.service';

@Component({
  selector: 'app-persona-juridica',
  templateUrl: './persona-juridica.component.html',
  styleUrls: ['./persona-juridica.component.css']
})
export class PersonaJuridicaComponent implements OnInit {


  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  PersonaJur:FormGroup;

  dataSourcePersonaJur: MatTableDataSource<RequestPersonaJur> = new MatTableDataSource<RequestPersonaJur>([]);

  columnas: string[] = ['orden', 'ruc', 'razon_social', 'estado', 'direccion', 'departamento'];

  constructor(private personaJurService: PersonaJuridicaService,private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router,
    
    ) {
      this.PersonaJur = this.formBuilder.group({
        dni: [''], // Debes definir los controles y validadores según tus necesidades.
        ruc: [''],
        razon_social: [''],
        estado: [''],
        direccion: [''],
        ubigeo: [''],
        departamento: [''],
        provincia: [''],
        distrito: ['']
      });
     }

  ngOnInit(): void {
this.listarPersonasJuridicas();
  }

/**
 * método que llama al microservicio.
 */
  buscarPersonaJuridica() {
    const personaJurControl = this.PersonaJur?.get('ruc');
    if (personaJurControl) {
      const ruc = personaJurControl.value;
  
      // Llamar al servicio para buscar la información con el RUC
      this.personaJurService.obtenerInformacionPersonaJuridica(ruc).subscribe(
        (data: any) => {
          // Asignar los valores obtenidos a los campos correspondientes
          this.PersonaJur.patchValue({
            ruc:data.ruc,
            razon_social: data.razon_social,
            estado: data.estado,
            direccion: data.direccion,
            ubigeo: data.ubigeo,
            departamento: data.departamento,
            provincia: data.provincia,
            distrito: data.distrito
          });
        },
        error => {
          // Manejar errores, como mostrar un mensaje de error
          console.error('Error al buscar la persona jurídica:', error);
        }
      );
    } else {
      console.error('El control de RUC es nulo.');
    }
  }
  
  
  

/**
 * método para registrar
 */
  registrarPersonaJur() {
    // Obtén los valores del formulario
    const formData = this.PersonaJur.value;
  
    // Crea un objeto RequestPersonaJur
    const requestPersonaJur: RequestPersonaJur = {
      
      ruc: formData.ruc,
      razon_social: formData.razon_social,
      estado: formData.estado,
      direccion: formData.direccion,
      ubigeo: formData.ubigeo,
      departamento: formData.departamento,
      provincia: formData.provincia,
      distrito: formData.distrito
    };
  
    // Llama al servicio para registrar la persona jurídica
    this.personaJurService.registrarPersonaJuridica(requestPersonaJur).subscribe(
      (response: any) => {

        Swal.fire({
          icon: 'success',
          title: 'Éxisto',
          text: 'La persona jurídica se ha registrado correectamente.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar'
        }).then(()=>{
         // Limpia el formulario después de un registro exitoso
        this.PersonaJur.reset();
        // Actualiza la lista de personas jurídicas
        this.listarPersonasJuridicas();
      } )    
         
      },
      (error) => {
       // Error al registrar, muestra un mensaje de error con SweetAlert
       if (error.error && error.error.error) {
        // Accede al campo "error" dentro del objeto de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.error, // Muestra el mensaje de error del servidor
          confirmButtonColor: '#d33',
          confirmButtonText: 'Aceptar'
        });
      } else {
        // Si el servidor no envió un mensaje de error específico, muestra un mensaje genérico
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al registrar la persona jurídica.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Aceptar'
        });
      }
      console.error('Error al registrar la persona jurídica:', error);
    }
    );
  }
  
  logout() {
    this.loginService.logout();
   // this.isLoggedIn = false;
  }

/**
 * método para listar desde la base de datos
 */
  listarPersonasJuridicas() {
    this.personaJurService.listarPersonasJuridicas().subscribe(
      (data: RequestPersonaJur[]) => {
        // Asigna los datos recibidos a la instancia de MatTableDataSource
        this.dataSourcePersonaJur.data = data;
      },
      error => {
        // En caso de error, manejarlo apropiadamente (puede mostrar un mensaje de error)
        console.error('Error al listar personas jurídicas:', error);
      }
    );
  }
}
