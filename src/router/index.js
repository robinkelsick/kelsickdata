import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/Pages/HomePage.vue'
import GenreRatings from '@/Pages/GenreRatings.vue'
import PopularityPage from '@/Pages/PopularityPage.vue'
import AboutMe from '@/Pages/AboutMe.vue'
import ProjectsPage from '@/Pages/ProjectsPage.vue'
import ContactPage from '@/Pages/ContactPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/genre-ratings', name: 'genre-ratings', component: GenreRatings },
    {
      path: '/popularity',
      name: 'popularity',
      component: PopularityPage,
      alias: '/popularity-vs-rating',
    },
    { path: '/about-me', name: 'about-me', component: AboutMe, alias: '/about' },
    { path: '/projects', name: 'projects', component: ProjectsPage, alias: '/work' },
    { path: '/contact', name: 'contact', component: ContactPage },
  ],
})

export default router
