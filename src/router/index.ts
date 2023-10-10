import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
// import { useConfigStore } from "@/stores/config";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/authentication/basic-flow/SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      }
    ],
  },  
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },       
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/Dashboard.vue"),
    meta: {
      pageTitle: "Dashboard",
      middleware: "auth",
      breadcrumbs: ["Dashboards"],
    },
  },
  {
                    path: "/AllShipment",
                    name: "AllShipment",
                    component: () => import("@/codeGenerator/AllShipment/views/AllShipmentView.vue"),
                    meta: {
                      pageTitle: "AllShipment",
                      middleware: "auth",
                      breadcrumbs: ["AllShipment"],
                    },
                  },
                  //4d92c553-4b96-4e9c-a12d-3de893057034 
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  // const configStore = useConfigStore();

  // current page view title
  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

  // reset config to initial state
  // configStore.resetLayoutConfig();

  // // verify auth token before each page change
  authStore.verifyAuth();

  if (authStore.isAuthenticated == false) {
    var currentUrl = window.location.href;
    // alert(currentUrl);
    if(currentUrl.includes("Token="))
    {      
      var token = currentUrl.split('Token=')[1];       
      authStore.verifyExternalAuth(token);
      next();
 
    }else if(currentUrl.includes("SessionKey=")){
      var token = currentUrl.split('SessionKey=')[1];       
      alert(token);
      authStore.verifySessionKey(token);
      // alert('haaaa');
      next();
    }
  }

  // before page access check if page requires authentication
  if (to.meta.middleware == "auth") {
    if (authStore.isAuthenticated) {
      next();
    } else {
      next({ name: "sign-in" });
    }
  } else {
    next();
  }

  // Scroll page to top on every route change
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

export default router;
