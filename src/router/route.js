const routes = [
  {
    path: "/",
    name: "Layout",
    redirect: "/home",
    component: () => import("@/Layout/index.vue"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/index.vue"),
      },
      {
        path: "incoming-message",
        name: "incoming-message",
        component: () => import("@/views/incomingMessage.vue"),
      },
      {
        path: "report-error",
        name: "report-error",
        component: () => import("@/views/reportError.vue"),
      },
      {
        path: "message-history",
        name: "message-history",
        component: () => import("@/views/messageHistory.vue"),
      },
      {
        path: "notifications",
        name: "notifications",
        component: () => import("@/views/notifications.vue"),
        meta: {
          hide: true,
        },
      },
    ],
  },
];

export default routes;
