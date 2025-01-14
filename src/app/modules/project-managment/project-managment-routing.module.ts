import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsProjectManagmentComponent} from './settings/components/settings.component';
import {SpaceComponent} from './start/components/space/space.component';
import {StartProjectManagmentComponent} from './start/components/start/start-project-managment.component';
import {CreateTaskComponent} from './task/components/create-task/create-task.component';
import {TaskDetailsComponent} from './task/components/task-details/task-details.component';
import {ProjectSettingsComponent} from "./project-settings/components/project-settings.component";
import { BacklogComponent } from './backlog/components/backlog.component';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { PlaningSprintComponent } from './backlog/planing/planing.component';
import { EpicDetailsComponent } from './task/components/epic/epic-details.component';
import { SprintComponent } from './sprint/components/sprint.component';
import { SprintDetailsComponent } from './sprint-details/components/sprint-details.component';

const routes: Routes = [
  {
    path: 'start', component: StartProjectManagmentComponent
  },

  {
    path: 'space', component: SpaceComponent
  },

  {
    path: 'space/details', component: TaskDetailsComponent
  },

  {
    path: 'space/create', component: CreateTaskComponent
  },

  {
    path: 'space/view-settings', component: SettingsProjectManagmentComponent
  },

  {
    path: 'space/project-settings', component: ProjectSettingsComponent
  },

  {
    path: 'space/backlog', component: BacklogComponent
  },

  {
    path: 'left-panel', component: LeftPanelComponent
  },

  {
    path: 'space/sprint/planing', component: PlaningSprintComponent
  },

  {
    path: 'space/epic', component: EpicDetailsComponent
  },

  {
    path: 'sprints', component: SprintComponent
  },

  {
    path: 'sprints/sprint/details', component: SprintDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProjectManagmentRoutingModule {
}
