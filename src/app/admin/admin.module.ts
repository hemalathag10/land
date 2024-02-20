import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { ManageAssetComponent } from './manage-asset/manage-asset.component';
import { ManageAssetFormDialogComponent } from './manage-asset/manage-asset-form-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { Page1Component } from './manage-asset/pages/page1/page1.component';
import { Page2Component } from './manage-asset/pages/page2/page2.component';

import { AssetService } from 'src/app/services/asset.service'; 
import { HttpClientModule } from '@angular/common/http';
import { OwnersDetailsDialogComponent } from './manage-asset/owners-details-dialog/owners-details-dialog.component';
import { StatsComponent } from './stats/stats.component';
import { AdminComponent } from './admin.component';
import { ReportsAnalyticsComponent } from './reports-analytics/reports-analytics.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { AdminLoginComponent } from '../admin-login/admin-login.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AuthService } from '../services/auth.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeedbackComponent } from './feedback/feedback.component';
import { SentimentAnalysisService } from '../services/sentimentAnalysis.service';
import { ChartComponent } from './feedback/chart.component';


@NgModule({
  declarations: [
    ManageAssetComponent,
    ManageAssetFormDialogComponent,
    Page1Component,
    Page2Component,
    OwnersDetailsDialogComponent,
    StatsComponent,
    AdminComponent,
    ReportsAnalyticsComponent,
    ManageUserComponent,
    FeedbackComponent,
    ChartComponent

  ],
  imports: [
    BrowserModule,
    RouterModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,MatDialogModule,
    FormsModule,
    AdminRoutingModule,
    HttpClientModule,
    NgSelectModule


  ],
  providers: [AssetService, AuthService,SentimentAnalysisService],
  bootstrap: []
})
export class AdminModule { }
