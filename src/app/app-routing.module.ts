import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrReaderComponent } from './components/pages/qr-reader/qr-reader.component';
import { HomeComponent } from './components/pages/home/home.component';
import { CreateNewLetterComponent } from './components/pages/create-new-letter/create-new-letter.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  // { path: 'home', component: HomeComponent },
  { path: 'qr-code', component: QrReaderComponent },
  { path: 'create-letter', component: CreateNewLetterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
