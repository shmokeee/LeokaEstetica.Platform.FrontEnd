import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { HeaderService } from "src/app/modules/header/services/header.service";
import { ApproveProjectInput } from "../../models/input/approve-project-input";
import { ApproveVacancyInput } from "../../models/input/approve-vacancy-input";
import { RejectProjectInput } from "../../models/input/reject-project-input";
import { RejectVacancyInput } from "../../models/input/reject-vacancy-input";
import { ApproveResumeInput } from "../../models/input/approve-resume-input";
import { RejectResumeInput } from "../../models/input/reject-resume-input";
import { CallCenterService } from "../../services/callcenter.service";
import { Router } from "@angular/router";
import { CreateProjectRemarksInput, ProjectRemarkInput } from "../../models/input/project-remark-input";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { MessageService } from "primeng/api";
import { SendProjectRemarkInput } from "../../models/input/send-project-remark-input";
import { CreateVacancyRemarksInput, VacancyRemarkInput } from "../../models/input/vacancy-remark-input";
import { SendVacancyRemarkInput } from "../../models/input/send-vacancy-remark-input";
import { CreateResumeRemarksInput, ResumeRemarkInput } from "../../models/input/resume-remark-input";
import { SendResumeRemarkInput } from "../../models/input/send-resume-remark-input";

@Component({
    selector: "callcenter",
    templateUrl: "./callcenter.component.html",
    styleUrls: ["./callcenter.component.scss"]
})

/**
 * Класс компонента КЦ.
 */
export class CallCenterComponent implements OnInit {
    public readonly headerData$ = this._headerService.headerData$;
    public readonly projectsModeration$ = this._callCenterService.projectsModeration$;
    public readonly projectModeration$ = this._callCenterService.projectModeration$;
    public readonly accessModeration$ = this._callCenterService.accessModeration$;
    public readonly projectRemarksModeration$ = this._callCenterService.projectRemarksModeration$;
    public readonly vacancyRemarksModeration$ = this._callCenterService.vacancyRemarksModeration$;
    public readonly resumeRemarksModeration$ = this._callCenterService.resumeRemarksModeration$;
    public readonly unShippedProjectRemarks$ = this._callCenterService.unShippedProjectRemarks$;
    public readonly projectsRemarks$ = this._callCenterService.projectsRemarks$;

    isHideAuthButtons: boolean = false;
    aProjects: any[] = [];
    totalProjects: number = 0;
    projectName: string = "";
    projectId: number = 0;
    isShowPreviewModerationProjectModal: boolean = false;
    projectDetails: string = "";
    aVacancies: any[] = [];
    totalVacancies: number = 0;
    vacancyName: string = "";
    vacancyText: string = "";
    workExperience: string = "";
    employment: string = "";
    payment: string = "";
    isShowPreviewModerationVacancyModal: boolean = false;
    vacancyId: number = 0;
    isProjectsModeration: boolean = false;
    isVacanciesModeration: boolean = false;
    stageName: string = '';
    aResumes: any[] = [];
    totalResumes: number = 0;
    isResumesModeration: boolean = false;
    profileInfoId: number = 0;
    isShowPreviewModerationResumeModal: boolean = false;
    resumeEmail: string = "";
    accessModeration: boolean = false;    

    items: any[] = [
        {
            label: 'Проекты',
            items: [
                [
                    {
                        label: 'Проекты на модерации',
                        items: [{
                            label: 'Список проектов', command: async () => {
                                this.isProjectsModeration = true; 
                                this.isVacanciesModeration = false;
                                this.isResumesModeration = false; 
                                this.isProjectsUnShippedRemarks = false;                                
                                this.clearRemarksProject();
                                await this.getProjectsModerationAsync();
                            }
                        }]
                    }
                ]
            ]
        },
        {
            label: 'Вакансии',
            items: [
                [
                    {
                        label: 'Вакансии на модерации',
                        items: [{
                            label: 'Список вакансий', command: async () => {
                                this.isProjectsModeration = false; 
                                this.isVacanciesModeration = true; 
                                this.isResumesModeration = false;
                                this.isProjectsUnShippedRemarks = false;
                                this.clearRemarksProject();
                                await this.getVacanciesModerationAsync();
                            }
                        }]
                    }
                ]
            ]
        },
        {
            label: 'Коммерция',
            items: [
                [
                    {
                        label: 'Платежи',
                        items: [{
                            label: 'Список платежей', command: async () => {
                            }
                        }]
                    },
                    {
                        label: 'Возвраты',
                        items: [{
                            label: 'Список возвратов', command: async () => {
                            }
                        }]
                    }
                ]
            ]
        },
        {
            label: 'Анкеты',
            items: [
                [
                    {
                        label: 'Анкеты на модерации',
                        items: [{
                            label: 'Список анкет', command: async () => {
                                this.isProjectsModeration = false; 
                                this.isVacanciesModeration = false; 
                                this.isResumesModeration = true; 
                                this.isProjectsUnShippedRemarks = false;
                                this.clearRemarksProject();
                                await this.getResumesModerationAsync();
                            }
                        }]
                    }
                ]
            ]
        },
        {
            label: 'Журнал модерации',
            items: [
                [
                    {
                        label: 'Замечания проектов',
                        items: [{
                            label: 'Не отправленные замечания', command: async () => {
                                this.isProjectsModeration = false; 
                                this.isVacanciesModeration = false; 
                                this.isResumesModeration = false; 
                                this.isProjectsUnShippedRemarks = true;
                                await this.getProjectUnShippedRemarksTableAsync();
                            }
                        }]
                    },
                    {
                        label: 'Замечания вакансий',
                        items: [{
                            label: 'Не отправленные замечания', command: async () => {
                                this.isProjectsModeration = false;
                                this.isVacanciesModeration = false;
                                this.isResumesModeration = false; 
                                this.isProjectsUnShippedRemarks = false;
                                this.clearRemarksProject();
                                // await this.getResumesModerationAsync();
                            }
                        }]
                    },
                    {
                        label: 'Замечания анкет',
                        items: [{
                            label: 'Не отправленные замечания', command: async () => {
                                this.isProjectsModeration = false;
                                this.isVacanciesModeration = false;
                                this.isResumesModeration = false;
                                this.isProjectsUnShippedRemarks = false;
                                this.clearRemarksProject();
                                // await this.getResumesModerationAsync();
                            }
                        }]
                    }
                ]
            ]
        }
    ];

    aRemarksProject: ProjectRemarkInput[] = [];
    allFeedSubscription: any;
    aRemarksVacancy: VacancyRemarkInput[] = [];
    aProfileComposite: any;
    aProfile: any = {};
    aIntents: any[] = [];
    aSkills: any[] = [];
    aRemarksResume: ResumeRemarkInput[] = [];
    isProjectsUnShippedRemarks: boolean = false;

    constructor(private readonly _headerService: HeaderService,
        private readonly _callCenterService: CallCenterService,
        private readonly _router: Router,
        private readonly _signalrService: SignalrService,
        private readonly _messageService: MessageService) {
    }

    public async ngOnInit() {
        forkJoin([
            await this.getHeaderItemsAsync(),
            await this._headerService.refreshTokenAsync(),
            await this.checkModerationUserRoleAsync()
        ]).subscribe();

        // Подключаемся.
        this._signalrService.startConnection().then(() => {
            console.log("Подключились");

            this.listenAllHubsNotifications();

            // Подписываемся на получение всех сообщений.
            this.allFeedSubscription = this._signalrService.AllFeedObservable
                .subscribe((response: any) => {
                    console.log("Подписались на сообщения", response);
                    this._messageService.add({ severity: response.notificationLevel, summary: response.title, detail: response.message });
                });
        });
    };

    /**
     * Функция слушает все хабы.
     */
     private listenAllHubsNotifications() {        
        this._signalrService.listenSuccessCreateProjectRemarks();
        this._signalrService.listenSuccessSendProjectRemarks();
        this._signalrService.listenWarningSendProjectRemarks();
        this._signalrService.listenSuccessCreateVacancyRemarks();
        this._signalrService.listenSuccessSendVacancyRemarks();
        this._signalrService.listenWarningSendVacancyRemarks();
        this._signalrService.listenSuccessCreateResumeRemarks();
        this._signalrService.listenWarningSendResumeRemarks();
        this._signalrService.listenSuccessSendResumeRemarks();
    };

    /**
     * Функция получит список элементов хидера.
     * @returns - Список элементов хидера.
     */
    private async getHeaderItemsAsync() {
        (await this._headerService.getHeaderItemsAsync())
            .subscribe(_ => {
                console.log("Данные хидера: ", this.headerData$.value);
            });
    };

    public async onSelectTabAsync(event: any) {
        console.log(event);

        // В зависимости от индекса срабатывает логика нужного таба.
        // switch (event.index) {
        //     case 0:
        //         await this.getProjectsModerationAsync();
        //         break;
        //
        //     // case 1:
        //     //
        //     //     break;
        // }
    };

    /**
     * Функция получает список проектов для модерации.
     * @returns - Список проектов.
     */
    private async getProjectsModerationAsync() {
        (await this._callCenterService.getProjectsModerationAsync())
            .subscribe((response: any) => {
                console.log("Проекты для модерации: ", response);
                this.aProjects = response.projects;
                this.totalProjects = response.total;
            });
    };

    /**
     * Функция получает проект для просмотра модератором.
     * @param projectId - Id проекта.
     * @returns - Данные проекта.
     */
    public async onPreviewProjectAsync(projectId: number) {
        this.projectId = projectId;

        (await this._callCenterService.previewProjectAsync(projectId))
            .subscribe((response: any) => {
                console.log("Проект для модерации: ", response);

                this.clearRemarksProject();

                this.isShowPreviewModerationProjectModal = true;
                this.projectName = response.projectName;
                this.projectDetails = response.projectDetails;        
                this.stageName = response.stageName;
            });
    };

    /**
     * Функция одобряет проект.
     * @param projectId - Id проекта.
     * @returns - Данные проекта.
     */
    public async onApproveProjectAsync(projectId: number) {
        let approveProjectInput = new ApproveProjectInput();
        approveProjectInput.ProjectId = projectId;

        (await this._callCenterService.approveProjectAsync(approveProjectInput))
            .subscribe(async (response: any) => {
                console.log("Апрув проекта: ", response);
                this.isShowPreviewModerationProjectModal = false;

                // Подтянем проекты для обновления таблицы.
                await this.getProjectsModerationAsync();
            });
    };

    /**
    * Функция отклоняет проект.
    * @param projectId - Id проекта.
    * @returns - Данные проекта.
    */
    public async onRejectProjectAsync(projectId: number) {
        let rejectProjectInput = new RejectProjectInput();
        rejectProjectInput.ProjectId = projectId;

        (await this._callCenterService.rejectProjectAsync(rejectProjectInput))
            .subscribe(async (response: any) => {
                console.log("Отклонение проекта: ", response);
                this.isShowPreviewModerationProjectModal = false;

                // Подтянем проекты для обновления таблицы.
                await this.getProjectsModerationAsync();
            });
    };

    /**
     * Функция получает список вакансий для модерации.
     * @returns - Список вакансий.
     */
    private async getVacanciesModerationAsync() {
        (await this._callCenterService.getVacanciesModerationAsync())
            .subscribe((response: any) => {
                console.log("Вакансии для модерации: ", response);
                this.aVacancies = response.vacancies;
                this.totalVacancies = response.total;
            });
    };

    /**
     * Функция получает вакансию для просмотра модератором.
     * @param vacancyId - Id вакансии.
     * @returns - Данные вакансии.
     */
    public async onPreviewVacancyAsync(vacancyId: number) {
        this.vacancyId = vacancyId;

        (await this._callCenterService.previewVacancyAsync(vacancyId))
            .subscribe((response: any) => {
                console.log("Вакансия для модерации: ", response);

                this.clearRemarksProject();

                this.isShowPreviewModerationVacancyModal = true;
                this.vacancyName = response.vacancyName;
                this.vacancyText = response.vacancyText;
                this.employment = response.employment;
                this.payment = response.payment;
                this.workExperience = response.workExperience;
            });
    };

    /**
     * Функция одобряет вакансию.
     * @param vacancyId - Id вакансии.
     * @returns - Данные проекта.
     */
    public async onApproveVacancyAsync(vacancyId: number) {
        let approveVacancyInput = new ApproveVacancyInput();
        approveVacancyInput.VacancyId = vacancyId;

        (await this._callCenterService.approveVacancyAsync(approveVacancyInput))
            .subscribe(async (response: any) => {
                console.log("Апрув вакансии: ", response);
                this.isShowPreviewModerationVacancyModal = false;

                // Подтянем вакансии для обновления таблицы.
                await this.getVacanciesModerationAsync();
            });
    };

    /**
    * Функция отклоняет вакансию.
    * @param vacancyId - Id вакансии.
    * @returns - Данные проекта.
    */
    public async onRejectVacancyAsync(vacancyId: number) {
        let rejectVacancyInput = new RejectVacancyInput();
        rejectVacancyInput.VacancyId = vacancyId;

        (await this._callCenterService.rejectVacancyAsync(rejectVacancyInput))
            .subscribe(async (response: any) => {
                console.log("Отклонение вакансии: ", response);
                this.isShowPreviewModerationVacancyModal = false;

                // Подтянем вакансии для обновления таблицы.
                await this.getVacanciesModerationAsync();
            });
    };

    /**
     * Функция получает список анкет для модерации.
     * @returns - Список анкеты.
     */
    private async getResumesModerationAsync() {
        (await this._callCenterService.getResumesModerationAsync())
            .subscribe((response: any) => {
                console.log("Анкеты для модерации: ", response);
                this.aResumes = response.resumes;
                this.totalResumes = response.total;
            });
    };

    /**
     * Функция получает анкету для просмотра модератором.
     * @param resumeId - Id анкеты.
     * @returns - Данные анкеты.
     */
    public async onPreviewResumeAsync(profileInfoId: number) {
        this.profileInfoId = profileInfoId;

        (await this._callCenterService.previewResumeAsync(profileInfoId))
            .subscribe((response: any) => {                
                this.clearRemarksProject();
                this.isShowPreviewModerationResumeModal = true;
                this.resumeEmail = response.email;
                this.aProfileComposite = response;
                this.aProfile = this.aProfileComposite.profileInfo;
                this.aIntents = this.aProfileComposite.intents;
                this.aSkills = this.aProfileComposite.skills;

                console.log("Анкеты для просмотра (композитные данные): ", this.aProfileComposite);
                console.log("Данные анкеты: ", this.aProfile);
            });
    };
    /**
     * Функция одобряет анкеты.
     * @param ResumeId - Id анкеты.
     * @returns - Данные анкеты.
     */
    public async onApproveResumeAsync(profileInfoId: number) {
        let approveResumeInput = new ApproveResumeInput();
        approveResumeInput.ProfileInfoId = profileInfoId;
        (await this._callCenterService.approveResumeAsync(approveResumeInput))
            .subscribe(async (response: any) => {
                console.log("Апрув анкеты: ", response);
                this.isShowPreviewModerationResumeModal = false;
                // Подтянем анкеты для обновления таблицы.
                await this.getResumesModerationAsync();
            });
    };
    /**
     * Функция отклоняет анкеты.
     * @param profileInfoId - Id анкеты.
     * @returns - Данные анкеты.
     */
    public async onRejectResumeAsync(profileInfoId: number) {
        let rejectResumeInput = new RejectResumeInput();
        rejectResumeInput.ProfileInfoId = profileInfoId;
        (await this._callCenterService.rejectResumeAsync(rejectResumeInput))
            .subscribe(async (response: any) => {
                console.log("Отклонение анкеты: ", response);
                this.isShowPreviewModerationResumeModal = false;
                // Подтянем анкеты для обновления таблицы.
                await this.getResumesModerationAsync();
            });
    };

    /**
       * Функция првоеряет доступ пользователя к модерации.
       * @returns - Признак доступа к модерации.
       */
    private async checkAvailableUserRoleModerationAsync() {
        (await this._callCenterService.checkAvailableUserRoleModerationAsync())
            .subscribe((response: any) => {
                console.log("Проверка роли модерации: ", this.accessModeration$.value);

                if (!response.accessModeration) {
                    this._router.navigate(["/user/signin"]);
                }
            });
    };

    /**
     * Функция проверяет доступ к КЦ.
     */
    private async checkModerationUserRoleAsync() {
        if (!localStorage["t_n"]) {
            this._router.navigate(["/user/signin"]);
         }

         else {
            await this.checkAvailableUserRoleModerationAsync();
         }
    };

    /**
     * Функция записывает замечания проекта.
     * @param fieldName - Название поля.
     * @param remarkText - Текст замечания.
     * @param russianName - Русское название поля.
     * @returns - Список замечаний проекта.
     */
    public onSetProjectRemarks(fieldName: string, remarkText: string, russianName: string) {
        let projectRemarkInput = new ProjectRemarkInput();
        projectRemarkInput.projectId = this.projectId;
        projectRemarkInput.fieldName = fieldName;
        projectRemarkInput.remarkText = remarkText;
        projectRemarkInput.russianName = russianName;
        
        this.aRemarksProject.push(projectRemarkInput);

        console.log("aRemarksProject", this.aRemarksProject);
    };

    /**
     * Функция сохраняет замечания проекта.
     * @returns - Список замечаний проекта.
     */
    public async onCreateProjectRemarksAsync() {
        let createProjectRemarksInput = new CreateProjectRemarksInput();
        createProjectRemarksInput.ProjectRemarks = this.aRemarksProject;

        (await this._callCenterService.createProjectRemarks(createProjectRemarksInput))
        .subscribe(_ => {
            console.log("Внесли замечания проекта: ", this.projectRemarksModeration$.value);
        });
    };

    /**
     * Функция отправляет замечания проекта.
     */
     public async onSendProjectRemarksAsync(projectId: number = 0) {
        let sendProjectRemarkInput = new SendProjectRemarkInput();

        if (this.projectId == 0) {
            this.projectId = projectId;
        }

        sendProjectRemarkInput.projectId = this.projectId;

        (await this._callCenterService.sendProjectRemarks(sendProjectRemarkInput))
        .subscribe(_ => {
            console.log("Отправили замечания проекта: ", this.projectRemarksModeration$.value);
        });
    };

    /**
     * Функция записывает замечания вакансии.
     * @param fieldName - Название поля.
     * @param remarkText - Текст замечания.
     * @param russianName - Русское название поля.
     * @returns - Список замечаний вакансии.
     */
     public onSetVacancyRemarks(fieldName: string, remarkText: string, russianName: string) {
        let vacancyRemarkInput = new VacancyRemarkInput();
        vacancyRemarkInput.vacancyId = this.vacancyId;
        vacancyRemarkInput.fieldName = fieldName;
        vacancyRemarkInput.remarkText = remarkText;
        vacancyRemarkInput.russianName = russianName;
        
        this.aRemarksVacancy.push(vacancyRemarkInput);

        console.log("aRemarksVacancy", this.aRemarksVacancy);
    };

    /**
     * Функция сохраняет замечания вакансии.
     * @returns - Список замечаний вакансии.
     */
     public async onCreateVacancyRemarksAsync() {
        let createVacancyRemarksInput = new CreateVacancyRemarksInput();
        createVacancyRemarksInput.VacanciesRemarks = this.aRemarksVacancy;

        (await this._callCenterService.createVacancyRemarks(createVacancyRemarksInput))
        .subscribe(_ => {
            console.log("Внесли замечания вакансии: ", this.vacancyRemarksModeration$.value);
        });
    };

    /**
     * Функция отправляет замечания вакансии.
     */
     public async onSendVacancyRemarksAsync() {
        let sendVacancyRemarkInput = new SendVacancyRemarkInput();
        sendVacancyRemarkInput.vacancyId = this.vacancyId;

        (await this._callCenterService.sendVacancyRemarks(sendVacancyRemarkInput))
        .subscribe(_ => {
            console.log("Отправили замечания вакансии: ", this.vacancyRemarksModeration$.value);
        });
    };

    /**
     * Функция записывает замечания анкеты.
     * @param fieldName - Название поля.
     * @param remarkText - Текст замечания.
     * @param russianName - Русское название поля.
     * @returns - Список замечаний анкеты.
     */
     public onSetResumeRemarks(fieldName: string, remarkText: string, russianName: string, profileInfoId: number) {
        let resumeRemarkInput = new ResumeRemarkInput();
        resumeRemarkInput.profileInfoId = profileInfoId;
        resumeRemarkInput.fieldName = fieldName;
        resumeRemarkInput.remarkText = remarkText;
        resumeRemarkInput.russianName = russianName;
        
        this.aRemarksResume.push(resumeRemarkInput);

        console.log("aRemarksResume", this.aRemarksResume);
    };

    /**
     * Функция сохраняет замечания анкеты.
     * @returns - Список замечаний анкеты.
     */
     public async onCreateResumeRemarksAsync() {
        let createResumeRemarksInput = new CreateResumeRemarksInput();
        createResumeRemarksInput.ResumesRemarks = this.aRemarksResume;

        (await this._callCenterService.createResumeRemarks(createResumeRemarksInput))
        .subscribe(_ => {
            console.log("Внесли замечания анкеты: ", this.resumeRemarksModeration$.value);
        });
    };

    /**
     * Функция отправляет замечания анкеты.
     @param profileInfoId - Id анкеты.
     */
     public async onSendResumeRemarksAsync(profileInfoId: number) {
        let sendResumeRemarkInput = new SendResumeRemarkInput();
        sendResumeRemarkInput.profileInfoId = profileInfoId;

        (await this._callCenterService.sendResumeRemarks(sendResumeRemarkInput))
        .subscribe(_ => {
            console.log("Отправили замечания анкеты: ", this.resumeRemarksModeration$.value);
        });
    };

     /**
     * Функция получает список замечаний проектов (не отправленные).
     * @param projectId - Id проекта, замечания которого нужно получить.
     */
      public async getProjectUnShippedRemarksAsync(projectId: number = 0) {
        if (this.projectId == 0) {
            this.projectId = projectId;
        }
        
        (await this._callCenterService.getProjectUnShippedRemarksAsync(this.projectId))
        .subscribe(_ => {
            console.log("Замечания проекта (не отправленные): ", this.unShippedProjectRemarks$.value);
            this.aRemarksProject = this.unShippedProjectRemarks$.value;
            this.isShowPreviewModerationProjectModal = true;
        });
    };

    /**
     * Функция получает список проектов, которые имеют замечания.
     */
     private async getProjectUnShippedRemarksTableAsync() {
        (await this._callCenterService.getProjectUnShippedRemarksTableAsync())
        .subscribe(_ => {
            console.log("Проекты с замечаниями: ", this.projectsRemarks$.value);
        });
    };    

    private clearRemarksProject() {
        this.aRemarksProject = [];
    };
}

