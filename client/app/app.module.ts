import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
import { AdService } from './services/ad.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { AppComponent } from './app.component';
import { AdsComponent } from './ads/ads.component';
import { ScreenComponent } from './screen/screen.component';

import { Template1Component } from './screen/Templates/Template1.component';
import { Template2Component } from './screen/Templates/Template2.component';
import { Template3Component } from './screen/Templates/Template3.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';



@NgModule({
  declarations: [
    AppComponent,
    AdsComponent,
    AboutComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    AccountComponent,
    AdminComponent,
    NotFoundComponent,
    ScreenComponent,
    Template1Component, 
    Template2Component,
    Template3Component
  ],
  imports: [
    RoutingModule,
    SharedModule,
    MultiselectDropdownModule
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    AdService,
    UserService
  ],
  entryComponents: [ Template1Component, Template2Component,Template3Component ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
