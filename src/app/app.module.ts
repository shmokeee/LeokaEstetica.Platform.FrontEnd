import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxLoadingModule } from 'ngx-loading';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NetworkInterceptor } from './core/interceptors/network-interceptor';
import { NetworkService } from './core/interceptors/network.service';
import { BackOfficeService } from './modules/backoffice/services/backoffice.service';
import { HeaderComponent } from './modules/header/components/header.component';
import { HeaderService } from './modules/header/services/header.service';
import { LandingService } from './modules/landing/services/landing.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxLoadingModule.forRoot({
      primaryColour: '#7C3AED',
      secondaryColour: '#7C3AED',
      tertiaryColour: '#7C3AED',
      fullScreenBackdrop: true
    })
  ],

  providers: [
    HeaderService,
    LandingService,
    BackOfficeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptor,
      multi: true
    },
    NetworkService
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
