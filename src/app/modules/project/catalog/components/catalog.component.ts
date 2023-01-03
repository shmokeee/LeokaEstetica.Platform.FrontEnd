import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectService } from "../../services/project.service";

@Component({
    selector: "",
    templateUrl: "./catalog.component.html",
    styleUrls: ["./catalog.component.scss"]
})

/**
 * Класс каталога проектов.
 */
export class CatalogProjectsComponent implements OnInit {
    constructor(private readonly _projectService: ProjectService,
        private readonly _router: Router) {
    }

    public readonly catalog$ = this._projectService.catalog$;

    public async ngOnInit() {
        forkJoin([
           await this.loadCatalogProjectsAsync()
        ]).subscribe();
    };

     /**
     * Функция загружает список вакансий для каталога.
     * @returns - Список вакансий.
     */
      private async loadCatalogProjectsAsync() {    
        (await this._projectService.loadCatalogProjectsAsync())
        .subscribe(_ => {
            console.log("Список проектов: ", this.catalog$.value);
        });
    };

    /**
     * Функция переходит к проекту, который выбрали.
     * @param projectId - Id проекта.
     */
    public async onRouteSelectedProject(projectId: number) {
        this._router.navigate(["/projects/project"], {
            queryParams: {
                projectId,
                mode: "view"
            }
        });
    };
}