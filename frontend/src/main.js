import Vue from 'vue';
import App from './App.vue';
import './plugins/vue-dialog';
import './plugins/vue-filter';
import './plugins/vue-moment';
import './plugins/vue-notification';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';

// Import global components
import BaseCard from './components/base/BaseCard.vue';
import BaseDialog from './components/base/BaseDialog.vue';
import BaseForm from './components/base/BaseForm.vue';
import BaseLoading from './components/base/BaseLoading.vue';
import BaseTable from './components/base/BaseTable.vue';

// Register global components
Vue.component('BaseCard', BaseCard);
Vue.component('BaseDialog', BaseDialog);
Vue.component('BaseTable', BaseTable);
Vue.component('BaseForm', BaseForm);
Vue.component('BaseLoading', BaseLoading);

// Global error handler
Vue.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err);
  console.error('Component:', vm);
  console.error('Info:', info);
  store.commit('SET_ERROR', err.message || 'An error occurred');
};

// Production tip
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app'); 