import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EncryptComponent } from './encrypt/encrypt.component'
import { DecryptComponent } from './decrypt/decrypt.component'

const routes: Routes = [
  { path: '', redirectTo: '/encrypt', pathMatch: 'full' },
  { path: 'encrypt', component: EncryptComponent },
  { path: 'decrypt', component: DecryptComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
