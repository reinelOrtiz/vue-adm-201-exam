import Vue from 'vue'
import Router from 'vue-router'
import AdmExamInitComponent from '@/components/AdmExamInitComponent'
import QuestionComponent from '@/components/QuestionComponent'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'AdmExamInitComponent',
      component: AdmExamInitComponent
    },
    {
      path: '/challenge/',
      name: 'QuestionComponent',
      component: QuestionComponent,
      props: true
    }
  ]
})
