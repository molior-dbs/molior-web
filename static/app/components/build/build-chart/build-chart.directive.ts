import moment from 'moment/src/moment';
import { BuildService } from '../build.service';
import { Util } from '@molior/app.util';
import { IRootScopeService } from 'angular';

/**
 * Represents a chart of builds
 */
class BuildChartController {
    private logger: any;
    private projectVersion: any;
    private isLoading: boolean;
    private type: any;
    private labels: any[];
    private serverDateFormat: string;
    private chartTypes: string[];
    private selectedChart: any;
    private data: any;
    private options: {
        responsive: boolean;
        maintainAspectRatio: boolean;
        scaleShowVerticalLines: boolean;
        scaleShowHorizontalLines: boolean;
        datasetStrokeWidth: number;
        pointDotStrokeWidth: number;
        scales: any;
    };
    constructor(
        private BuildService: BuildService,
        private Log: any,
        private Util: Util,
        private $scope: IRootScopeService,
        private $q: any,
    ) {
        this.logger = Log.init('BuildChartController');
        this.projectVersion = this.projectVersion;
        this.$scope = $scope;

        this.isLoading = true;
        this.type = this.type;
        this.labels = [];
        this.serverDateFormat = 'YYYY-MM-DD HH:MM:ss';
        this.$scope.$on('chart-create', this.onChartCreate);
        this.chartTypes = ['Today', 'Week', 'Month', 'Year'];
    }

    /**
     * Initializes the build chart
     */
    public $onInit() {
        this.updateChart();
        this.selectedChart = this.selectedChart || 'year';
        this.$scope.$watch(() => this.type, (newValue, oldValue) => {
            if (oldValue !== newValue) {
                this.updateChart();
            }
        });
    }

    /**
     * Updates the chart by the type. Loads the corresponding data and generates
     * the labels, then rerenders the chart
     *
     * @returns {Promise} The promise when everything is ready
     */
    private updateChart() {
        this.logger.info(`Loading this ${this.type}s-build chart`);
        switch (this.type.toLowerCase()) {
        case 'today':
            return this.loadBuildsFromToday().then(() => {
                this.isLoading = false;
                this.generateTodayLabels();
                this.renderChart();
            });
        case 'week':
            return this.loadBuildsFromThisWeek().then(() => {
                this.isLoading = false;
                this.generateWeekLabels();
                this.renderChart();
            });
        case 'month':
            return this.loadBuildsFromThisMonth().then(() => {
                this.isLoading = false;
                this.generateMonthLabels();
                this.renderChart();
            });
        case 'year':
            return this.loadBuildsFromThisYear().then(() => {
                this.isLoading = false;
                this.generateYearLabels();
                this.renderChart();
            });
        }
    }

    /**
     * Sets the label array to todays hours (minus 23 hours)
     */
    private generateTodayLabels() {
        this.labels = [];
        for (let i = 23; i >= 0; i--) {
            this.labels.push(`${moment().subtract(i, 'hours').format('HH')}:00`);
        }
    }

    /**
     * Sets the data array to the builds count of the hours
     *
     * @returns {Promise} The async promise
     */
    private loadBuildsFromToday() {
        const promises = [];
        for (let i = 23; i >= 0; i--) {
            const from = moment().subtract(i, 'hours').startOf('hour').format(this.serverDateFormat);
            const to = moment().subtract(i, 'hours').endOf('hour').format(this.serverDateFormat);
            const options: any = {
                from,
                to,
                count_only: true,
            };
            if (this.projectVersion) {
                options.project_version_id = this.projectVersion.id;
            }
            promises.push(this.BuildService.all(options));
        }
        return this.$q.all(promises).then((data) => {
            this.data = data.map((item) => item.total_result_count);
        });
    }

    /**
     * Sets the label array to months (= minus 11 months)
     */
    private generateYearLabels() {
        this.labels = [];
        for (let i = 11; i >= 0; i--) {
            this.labels.push(moment().subtract(i, 'months').format('MMMM'));
        }
    }

    /**
     * Sets the data array to the builds count of the months
     *
     * @returns {Promise} The async promise
     */
    private loadBuildsFromThisYear() {
        const promises = [];
        for (let i = 12; i >= 0; i--) {
            const from = moment().subtract(i, 'months').startOf('month').format(this.serverDateFormat);
            const to = moment().subtract(i, 'months').endOf('month').format(this.serverDateFormat);
            const options: any = {
                from,
                to,
                count_only: true,
            };
            if (this.projectVersion) {
                options.project_version_id = this.projectVersion.id;
            }
            promises.push(this.BuildService.all(options));
        }
        return this.$q.all(promises).then((data) => {
            this.data = data.map((item) => item.total_result_count);
        });
    }

    /**
     * Sets the label array to days (= minus 6 days)
     *
     * @memberof BuildChartController
     */
    private generateWeekLabels() {
        this.labels = [];
        for (let i = 6; i >= 0; i--) {
            this.labels.push(moment().subtract(i, 'days').format('dddd'));
        }
    }

    /**
     * Sets the data array to the builds count of the days
     *
     * @returns {Promise} The async promise
     */
    private loadBuildsFromThisWeek() {
        const promises = [];
        for (let i = 6; i >= 0; i--) {
            const from = moment().subtract(i, 'days').startOf('day').format(this.serverDateFormat);
            const to = moment().subtract(i, 'days').endOf('day').format(this.serverDateFormat);
            const options: any = {
                from,
                to,
                count_only: true,
            };
            if (this.projectVersion) {
                options.project_version_id = this.projectVersion.id;
            }
            promises.push(this.BuildService.all(options));
        }
        return this.$q.all(promises).then((data) => {
            this.data = data.map((item) => item.total_result_count);
        });
    }

    /**
     * Sets the label array to days (= minus 6 days)
     *
     * @memberof BuildChartController
     */
    private generateMonthLabels() {
        this.labels = [];
        for (let i = 30; i >= 0; i--) {
            this.labels.push(moment().subtract(i, 'days').format('DD.MM.YY'));
        }
    }

    /**
     * Sets the data array to the builds count of the days
     *
     * @returns {Promise} The async promise
     */
    private loadBuildsFromThisMonth() {
        const promises = [];
        for (let i = 30; i >= 0; i--) {
            const from = moment().subtract(i, 'days').startOf('day').format(this.serverDateFormat);
            const to = moment().subtract(i, 'days').endOf('day').format(this.serverDateFormat);
            const options: any = {
                from,
                to,
                count_only: true,
            };
            if (this.projectVersion) {
                options.project_version_id = this.projectVersion.id;
            }
            promises.push(this.BuildService.all(options));
        }
        return this.$q.all(promises).then((data) => {
            this.data = data.map((item) => item.total_result_count);
        });
    }

    /**
     * Renders the chart
     */
    private renderChart() {
        const highestValue = Math.max.apply(Math, this.data);
        const step = 5;
        this.options = {
            responsive: true,
            maintainAspectRatio: false,
            scaleShowVerticalLines: false,
            scaleShowHorizontalLines: false,
            datasetStrokeWidth: 3,
            pointDotStrokeWidth: 4,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        scaleOverride: true,
                        scaleSteps: step,
                        scaleStepWidth: Math.ceil(highestValue / step),
                        scaleStartValue: 0,
                        fontFamily: 'Roboto',
                    },
                    gridLines: {
                        color: 'rgba(255,255,255,0.0)',
                        zeroLineColor: 'rgba(255,255,255,0.0)',
                    },
                }],
                xAxes: [{
                    ticks: {
                        fontFamily: 'Roboto',
                    },
                    gridLines: {
                        color: 'rgba(255,255,255,0.0)',
                        zeroLineColor: 'rgba(255,255,255,0.0)',
                    },
                }],
            },
        };
    }

    /**
     * Gets called when the chart gets created
     */
    private onChartCreate(evt, chart) {
        const ctx = chart.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(30,136,229, 1)');
        chart.chart.config.data.datasets[0].backgroundColor = gradient;
        chart.chart.config.data.datasets[0].pointRadius = 4;
        chart.chart.config.data.datasets[0].pointBorderColor = 'rgba(0,0,0,0)';
        chart.chart.config.data.datasets[0].pointBackgroundColor = 'rgba(0,0,0,0)';
        chart.chart.config.data.datasets[0].borderColor = 'rgba(0,0,0,0)';
        chart.update();
    }
}

/**
 * Represents a chart of builds
 * @param {Object} projectVersion The project version to have a chart of
 */
export const BuildChartDirective = () => {
    return {
        restrict: 'E',
        controller: BuildChartController,
        controllerAs: '$ctrl',
        bindToController: true,
        scope: {
            projectVersion: '=',
            type: '@',
        },
        template: `
        <div flex>
            <div flex layout-align='end center' layout='row'>
                <md-input-container>
                    <md-select ng-model='$ctrl.type'>
                        <md-option ng-repeat='chartType in $ctrl.chartTypes' ng-value='chartType.toLowerCase()' ng-bind='chartType'>
                        </md-option>
                    </md-select>
                </md-input-container>
            </div>
            <div flex>
                <canvas id='line' class='chart chart-line' chart-data='$ctrl.data' chart-labels='$ctrl.labels' chart-options='$ctrl.options'></canvas>
            </div>
        </div>
        `,
    };
};
