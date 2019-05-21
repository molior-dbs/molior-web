import './mirror-form.style.scss';

// tslint:disable-next-line:no-var-requires
const template = require('./mirror-form.tmp.html');
import { MirrorService } from './mirror.service';
import { StateService } from '@uirouter/core';
import { ArchitectureService } from '../architecture/architecture.service';
import { MoliorInfoService } from '@molior/core/api/info/molior-info.service';
import { ProjectVersionService } from '../project-version/project-version.service';
import { ProjectVersionDetail } from '../project-version/interfaces';
import { Architecture } from '../architecture/interfaces';

/**
 * Handles the mirror creation functionality.
 */
class MirrorFormController {
    private isCreatingMirror: boolean;
    private ngModel: any;
    private selectedKeyOption: any;
    private currentStep: number;
    private status: string;
    private basemirrors: ProjectVersionDetail[];
    private aptlyhostname: any;
    private architectures: Architecture[];

    constructor(
        private MirrorService: MirrorService,
        private $mdDialog: any,
        private ArchitectureService: ArchitectureService,
        private $mdStepper: any,
        private MoliorInfoService: MoliorInfoService,
        private ProjectVersionService: ProjectVersionService,
    ) {
        this.isCreatingMirror = false;
        this.ngModel = {};
    }

    /**
     * Initializes the component and loads architectures
     */
    public $onInit() {
        this.ngModel = this.ngModel || {};
        this.ngModel.components = ['main'];
        this.ngModel.keys = [];
        this.ngModel.download_sources = true;
        this.ngModel.download_installer = true;

        this.selectedKeyOption = this.selectedKeyOption || 0;
        this.currentStep = 0;
        this.status = '';

        this.loadArchitectures();

        this.ProjectVersionService
            .all({ isbasemirror: true })
            .then((data) => {
                this.basemirrors = data.results;
            });

        this.MoliorInfoService
            .getAptlyhostname()
            .then((hostname) => {
                if (!hostname.endsWith('/')) {
                    hostname += '/';
                }
                this.aptlyhostname = hostname;
            });
    }

    private loadArchitectures() {
        this.ArchitectureService
            .all()
            .then((data) => {
                this.architectures = data.results;
            });
    }

    /**
     * # Handler function for 'Create' button
     * This function checks the content of the fields filled by the user
     *
     * @example
     * <pre>
     *    $ctrl.create().then(console.log, console.log);
     * </pre>
     *
     * @returns {Promise} The promise when the mirror is created
     */
    private create(rawMirror, selectedKeyOption) {
        rawMirror.architectures = rawMirror.architectures.filter((architecture) => {
            return this.getArchitectures().indexOf(architecture) !== -1;
        });

        this.status = '';
        this.isCreatingMirror = true;
        const mirror: any = {
            name: rawMirror.name,
            url: rawMirror.url,
            distribution: rawMirror.distribution,
            architectures: rawMirror.architectures,
            is_basemirror: rawMirror.is_basemirror === true,
            version: rawMirror.version,
            components: rawMirror.components,
            basemirror_id: (!rawMirror.basemirror) ? undefined : rawMirror.basemirror.id,
            download_installer: (rawMirror.is_basemirror === true) ? rawMirror.download_installer : false,
            download_sources: rawMirror.download_sources,
        };

        if (selectedKeyOption === 0) {
            mirror.armored_key_url = rawMirror.armored_key_url;
        } else if (selectedKeyOption === 1) {
            mirror.keys = rawMirror.keys;
            mirror.keyserver = rawMirror.keyserver;
        }

        return this.MirrorService
            .post(mirror)
            .then(() => this.$mdDialog.hide())
            .catch((response) => {
                this.status = response.data;
                this.isCreatingMirror = false;
            });
    }

    private getArchitectures() {
        if (this.ngModel.is_basemirror) {
            return this.architectures.map((architecture) => architecture.name);
        }
        if (!this.ngModel.basemirror) {
            return [];
        }
        return this.ngModel.basemirror.mirror_architectures;
    }

    /**
     * # Handler function for 'Cancel' button
     * This function exits and closes the modal dialog
     *
     * @example
     * <pre>
     *    $ctrl.cancel();
     * </pre>
     *
     */
    private cancel() {
        this.$mdDialog.cancel();
    }

    /**
     * This function goes to the next step of the mirror form
     * material design stepper
     */
    private nextStep() {
        this.currentStep++;
        this.$mdStepper('mirror-form-stepper').next();
    }

    /**
     * This function goes to the previous step of the mirror form
     * material design stepper
     */
    private previousStep() {
        this.currentStep--;
        this.$mdStepper('mirror-form-stepper').back();
    }
}

/**
 * Directive which is the mirror form
 *
 * @param {Number} selectedKeyOption 0, 1 or 2, for the mirror key option
 * @param {Object} ngModel The model
 */
export const MirrorFormComponent = {
    templateUrl: template,
    controller: MirrorFormController,
    bindings: {
        selectedKeyOption: '<',
        ngModel: '<',
    },
};
