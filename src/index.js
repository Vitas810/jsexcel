import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Router } from './core/routes/Router';
import { DashboardPage } from './pages/DashboardPage';
import { ExcelPage } from './pages/ExcelPage';
import 'normalize.css';
import './scss/index.scss';

new Router('#app', {
  dashboard: DashboardPage,
  excel: ExcelPage
});
