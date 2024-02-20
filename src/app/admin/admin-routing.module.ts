
// admin-dashboard/admin-dashboard-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageAssetComponent } from './manage-asset/manage-asset.component';
import { StatsComponent } from './stats/stats.component';
import { AdminComponent } from './admin.component';
import { ReportsAnalyticsComponent } from './reports-analytics/reports-analytics.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { AssetService } from '../services/asset.service';
import { FeedbackComponent} from './feedback/feedback.component';
const routes: Routes = [
    {
      path: '',
      component: AdminComponent,
      children: [
        { path: 'manage-asset', component: ManageAssetComponent },
        { path: 'stats', component: StatsComponent },
        { path: 'reports-analytics', component: ReportsAnalyticsComponent },
        { path: 'manage-user', component: ManageUserComponent },
        { path: 'feedback', component: FeedbackComponent },

        { path: '', redirectTo: 'stats', pathMatch: 'full' },
      ]
    }
  ];


@NgModule({
  // imports: [RouterModule.forChild(routes)],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[AssetService]
})
export class AdminRoutingModule { }