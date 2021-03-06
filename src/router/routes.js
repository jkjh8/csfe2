const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/auth/login.vue')
      }
    ]
  },
  {
    path: '/register',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/auth/register.vue')
      }
    ]
  },
  {
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/users/userInfo.vue')
      }
    ]
  },

  {
    path: '/devices',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'devices',
        component: () => import('src/pages/devices/devices.vue')
      },
      {
        path: 'zones',
        component: () => import('src/pages/devices/zones.vue')
      }
    ]
  },

  {
    path: '/management',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'files',
        component: () => import('src/pages/management/files.vue')
      },
      {
        path: 'eventlog',
        component: () => import('src/pages/management/eventlog.vue')
      },
      {
        path: 'playlist',
        component: () => import('src/pages/management/playlist.vue')
      }
    ]
  },

  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'status',
        component: () => import('src/pages/admin/status')
      },
      {
        path: 'users',
        component: () => import('src/pages/admin/users.vue')
      },
      {
        path: 'files',
        component: () => import('src/pages/admin/files.vue')
      },
      {
        path: 'systemlog',
        component: () => import('src/pages/admin/systemlog.vue')
      }
    ]
  },

  {
    path: '/broadcast',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'status',
        component: () => import('src/pages/broadcast/status.vue')
      },
      {
        path: 'live',
        component: () => import('src/pages/broadcast/live.vue')
      },
      {
        path: 'schedules',
        component: () => import('src/pages/broadcast/schedules.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
