import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

/**
 * Класс сервиса модуля управления проектами.
 */
@Injectable()
export class ProjectManagmentService {
    apiUrl: any;

    public availableProjectManagment$ = new BehaviorSubject<any>(null);
    public userProjects$ = new BehaviorSubject<any>(null);
    public viewStrategies$ = new BehaviorSubject<any>(null);
    public headerItems$ = new BehaviorSubject<any>(null);
    public projectManagmentTemplates$ = new BehaviorSubject<any>(null);
    public workSpaceConfig$ = new BehaviorSubject<any>(null);
    public taskDetails$ = new BehaviorSubject<any>(null);
    public priorities$ = new BehaviorSubject<any>(null);
    public taskTypes$ = new BehaviorSubject<any>(null);
    public taskTags$ = new BehaviorSubject<any>(null);
    public taskStatuses$ = new BehaviorSubject<any>(null);
    public taskExecutors$ = new BehaviorSubject<any>(null);

    constructor(private readonly _http: HttpClient) {
        // Если используем ендпоинты модуля УП.
        if (API_URL.apiUrlProjectManagment !== null && API_URL.apiUrlProjectManagment !== undefined) {
            this.apiUrl = API_URL.apiUrlProjectManagment;
        }

        // Если используем основные ендпоинты.
        else {
            this.apiUrl = API_URL.apiUrl
        }
    }

    /**
    * Функция проверяет доступность модуля УП.
    * @returns - Признак доступности модуля УП.
    */
    public async availableProjectManagmentAsync() {
        return await this._http.get(this.apiUrl + "/project-managment/config/is-available-project-managment").pipe(
            tap(data => this.availableProjectManagment$.next(data))
        );
    };

    /**
    * Функция получает список проектов пользователя.
    * @returns - Список проектов.
    */
    public async getUseProjectsAsync() {
        return await this._http.get(this.apiUrl + "/project-managment/user-projects").pipe(
            tap(data => this.userProjects$.next(data))
        );
    };

    /**
   * Функция получает список стратегий представления.
   * @returns - Список стратегий.
   */
    public async getViewStrategiesAsync() {
        return await this._http.get(this.apiUrl + "/project-managment/view-strategies").pipe(
            tap(data => this.viewStrategies$.next(data))
        );
    };

    /**
     * Функция получает список элементов меню хидера (верхнее меню).
     * @returns - Список элементов.
     */
    public async getHeaderItemsAsync() {
        return await this._http.get(this.apiUrl + "/project-managment/header").pipe(
            tap(data => this.headerItems$.next(data))
        );
    };

    /**
    * Функция получает список шаблонов со статусами для выбора пользователю
    * @returns - Список шаблонов.
    */
    public async getProjectManagmentTemplatesAsync() {
        return await this._http.get(this.apiUrl + "/project-managment/templates").pipe(
            tap(data => this.projectManagmentTemplates$.next(data))
        );
    };

    /**
    * Функция получает конфигурацию рабочего пространства по выбранному шаблону.
    * Под конфигурацией понимаются основные элементы рабочего пространства (набор задач, статусов, фильтров, колонок и тд)
    * если выбранный шаблон это предполагает.
    * @param projectId - Id проекта.
    * @param strategy - Выбранная стратегия.
    * @param templateId - Id выбранного шаблона.
    * @returns - Данные конфигурации.
    */
    public async getConfigurationWorkSpaceBySelectedTemplateAsync(projectId: number, strategy: string,
        templateId: number) {
        return await this._http.get(this.apiUrl + `/project-managment/config-workspace-template?projectId=${projectId}
        &strategy=${strategy}
        &templateId=${templateId}`).pipe(
            tap(data => this.workSpaceConfig$.next(data))
        );
    };

     /**
    * Функция получает детали задачи.
    * @param projectId - Id проекта.
    * @param taskId - Id задачи.
    * @returns - Данные конфигурации.
    */
      public async getTaskDetailsByTaskIdAsync(projectId: number, projectTaskId: number) {
        return await this._http.get(this.apiUrl + `/project-managment/task?projectTaskId=${projectTaskId}&projectId=${projectId}`).pipe(
            tap(data => this.taskDetails$.next(data))
        );
    };

     /**
    * Функция получает приоритеты задачи для выбора.
    * @returns - Приоритеты задачи.
    */
      public async getTaskPrioritiesAsync() {
        return await this._http.get(this.apiUrl + "/project-managment/priorities").pipe(
            tap(data => this.priorities$.next(data))
        );
    };

     /**
    * Функция получает типы задач для выбора.
    * @returns - Типы задач.
    */
      public async getTaskTypesAsync() {
        return await this._http.get(this.apiUrl + "/project-managment/task-types").pipe(
            tap(data => this.taskTypes$.next(data))
        );
    };

    /**
    * Функция получает теги задач для выбора.
    * @returns - Список тегов.
    */
     public async getTaskTagsAsync() {
        return await this._http.get(this.apiUrl + "/project-managment/task-tags").pipe(
            tap(data => this.taskTags$.next(data))
        );
    };

    /**
    * Функция получает статусы задач для выбора.
    * Статусы выводятся в рамках шаблона.
    * @returns - Список статусов.
    */
     public async getTaskStatusesAsync(projectId: number) {
        return await this._http.get(this.apiUrl + `/project-managment/task-statuses?projectId=${projectId}`).pipe(
            tap(data => this.taskStatuses$.next(data))
        );
    };

    /**
    * Функция получает исполнителей или наблюдателей для выбора.
    * @returns - Список пользователей.
    */
     public async getSelectTaskPeopleAsync(projectId: number) {
        return await this._http.get(this.apiUrl + `/project-managment/select-task-people?projectId=${projectId}`).pipe(
            tap(data => this.taskExecutors$.next(data))
        );
    };
}
