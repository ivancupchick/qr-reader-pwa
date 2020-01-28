import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrReaderComponent } from './components/pages/qr-reader/qr-reader.component';
import { HomeComponent } from './components/pages/home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent},
  { path: 'qr-code', component: QrReaderComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
