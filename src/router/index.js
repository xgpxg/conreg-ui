import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router'
import Layout from '@/layout/index.vue'

const routes = [
    // 登录页
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录'
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
                    title: '配置管理'
                }
            },
            {
                path: 'config/add-config',
                name: 'AddConfig',
                component: () => import('@/views/config/add-config.vue'),
                meta: {
                    title: '添加配置'
                }
            },
            {
                path: 'config/update-config',
                name: 'UpdateConfig',
                component: () => import('@/views/config/update-config.vue'),
                meta: {
                    title: '修改配置'
                }
            },
            {
                path: 'service',
                name: 'Service',
                component: () => import('@/views/service/index.vue'),
                meta: {
                    title: '服务管理'
                }
            },
            {
                path: 'service/detail',
                name: 'ServiceDetail',
                component: () => import('@/views/service/service-detail.vue'),
                meta: {
                    title: '服务详情'
                }
            },
            {
                path: 'namespace',
                name: 'Namespace',
                component: () => import('@/views/namespace/index.vue'),
                meta: {
                    title: '命名空间'
                }
            },
            {
                path: 'cluster',
                name: 'Cluster',
                component: () => import('@/views/cluster/index.vue'),
                meta: {
                    title: '集群管理'
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
        document.title = `${to.meta.title}`;
    }
    next()
})

export default router