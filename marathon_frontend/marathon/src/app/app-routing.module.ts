import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonaJuridicaComponent } from './_pages/persona-juridica/persona-juridica.component';
import { LoginComponent } from './_pages/login/login.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige a LoginComponent
  {path: 'logout', component: LoginComponent},

{
    path: 'personasJur', component: PersonaJuridicaComponent
},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
