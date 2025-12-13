import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router'
import Layout from '@/layout/index.vue'
import i18n from '@/locales/index.js'

const routes = [
    // 登录页
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: i18n.global.t('登录')
        }
    },
    // 配置管理页
    {
        path: '/',
        component: Layout,
        redirect: '/config',
        children: [
            {
                path: 'config',
                name: 'Config',
                component: () => import('@/views/config/index.vue'),
                meta: {
                    title: i18n.global.t('配置管理')
                }
            },
            {
                path: 'config/add-config',
                name: 'AddConfig',
                component: () => import('@/views/config/add-config.vue'),
                meta: {
                    title: i18n.global.t('添加配置')
                }
            },
            {
                path: 'config/update-config',
                name: 'UpdateConfig',
                component: () => import('@/views/config/update-config.vue'),
                meta: {
                    title: i18n.global.t('修改配置')
                }
            },
            {
                path: 'service',
                name: 'Service',
                component: () => import('@/views/service/index.vue'),
                meta: {
                    title: i18n.global.t('服务管理')
                }
            },
            {
                path: 'service/detail',
                name: 'ServiceDetail',
                component: () => import('@/views/service/service-detail.vue'),
                meta: {
                    title: i18n.global.t('服务详情')
                }
            },
            {
                path: 'namespace',
                name: 'Namespace',
                component: () => import('@/views/namespace/index.vue'),
                meta: {
                    title: i18n.global.t('命名空间')
                }
            },
            {
                path: 'cluster',
                name: 'Cluster',
                component: () => import('@/views/cluster/index.vue'),
                meta: {
                    title: i18n.global.t('集群管理')
                }
            },
        ]
    }
]


const router = createRouter({
    //history: createWebHashHistory(),  // hash 模式
    history: createWebHistory(),  // history 模式
    routes: routes
})

router.beforeEach((to, from, next) => {
    // console.log(to, from)
    if (to.meta.title) {
        document.title = i18n.global.t(to.meta.title);
    }
    next()
})

export default router