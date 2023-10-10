<template> 
  <RouterView />
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeMount, onMounted } from "vue";
import { RouterView } from "vue-router";
import { useBodyStore } from "@/stores/body";
import { useAuthStore, type User } from "@/stores/auth";
import 'devexpress-gantt/dist/dx-gantt.css';
import './styles.scss';
import "devextreme/dist/css/dx.light.css";
// import "@/core/plugins/prismjs";
import DataGrid from "devextreme/ui/data_grid";
import JwtService from "@/core/services/JwtService";
import ApiService from "@/core/services/ApiService";

export default defineComponent({
  name: "app",
  components: {
    RouterView,
  },
  setup() {
    // const configStore = useConfigStore();
    // const themeStore = useThemeStore();
    const bodyStore = useBodyStore();   
    const store = useAuthStore();

    const columnChooserModes = [{
        key: 'dragAndDrop',
        name: 'Drag and drop',
      }, {
        key: 'select',
        name: 'Select',
      }];
    
    onBeforeMount(() => {
      /**
       * Overrides the layout config using saved data from localStorage
       * remove this to use static config (@/core/config/DefaultLayoutConfig.ts)
       */
      // configStore.overrideLayoutConfig();
      window.addEventListener('message', (event) => {
        if (event.data.url.includes(location.host)) {
          store.verifyExternalAuth(event.data.token);
          if (event.data.tenant != JwtService.getTenant()) {
            JwtService.destroyTenant();
            JwtService.setTenant(event.data.tenant);
            ApiService.vueInstance.axios.defaults.headers.common["Tenant"] = JwtService.getTenant();      
            location.reload();
          }
        }
      });
      /**
       *  Sets a mode from configuration
       */
      // themeStore.setThemeMode(themeConfigValue.value);      

      DataGrid.defaultOptions({  
          options: {  
            allowColumnReordering:true,
            allowColumnResizing: true,
            columnAutoWidth:true,
            remoteOperations : true,
            // showRowLines: true,  
            // showColumnLines: false,  
            // rowAlternationEnabled: false,  
            focusedRowEnabled: false,  
            // noDataText: "",  
            // scrolling: {  
            //   mode: "virtual"  
            // },  
            // sorting: {  
            //   mode: "single"  
            // },  
            selection: {
                mode: "multiple", // or "multiple" | "none",
                recursive: true,
                selectByClick: true,
                allowSelectAll: true,
            },
            searchPanel: { visible: true },
            filterPanel: { visible: true },
            filterRow: { visible: true },
            loadPanel: {  
              enabled: false  
            },
            groupPanel: {
              visible: true,
            },
            export: {
                allowExportSelectedData : true,
                enabled: true,
                formats: ['xlsx', 'pdf'],
            },
            // stateStoring: {
            //   enabled: true,
            //   type: 'localStorage',
            //   storageKey: 'storage',
            // },
            columnFixing: {
              enabled: true,
            },
            paging : {
              pageSize : 5,
            },
            pager : {
              visible : true,
              allowedPageSizes : [5, 10, 20, 'all'], 
              displayMode : 'full',
              showPageSizeSelector : true,
              showInfo : true,
              showNavigationButtons : true,
            },
            columnChooser: {
              enabled: true,
              mode: columnChooserModes[1].key,
              position: {
                my: 'right top',
                at: 'right bottom',
                of: '.dx-datagrid-column-chooser-button',
              },
              search: {
                enabled: true,
                editorOptions: { placeholder: 'Search column' },
              }
            }
          }  
      });

    });

    onMounted(() => {
      nextTick(() => {
        // initializeComponents();
        bodyStore.removeBodyClassName("page-loading");
      });
    });
  },
  mounted() {
    const store = useAuthStore();
    window.addEventListener('message', (event) => {
      if (event.data.url.includes(location.host)) {
        if(event.data.token != JwtService.getToken()) {
          store.verifyExternalAuth(event.data.token);
        }
       
        if (event.data.tenant != JwtService.getTenant()) {
          JwtService.destroyTenant();
          JwtService.setTenant(event.data.tenant);
          ApiService.vueInstance.axios.defaults.headers.common["Tenant"] = JwtService.getTenant();      
          location.reload();
        }
      }
    })
  },
});
</script>

<style lang="scss">
@import "bootstrap-icons/font/bootstrap-icons.css";
// @import "apexcharts/dist/apexcharts.css";
// @import "quill/dist/quill.snow.css";
// @import "animate.css";
@import "sweetalert2/dist/sweetalert2.css";
// @import "nouislider/distribute/nouislider.css";
// @import "@fortawesome/fontawesome-free/css/all.min.css";
// @import "socicon/css/socicon.css";
// @import "line-awesome/dist/line-awesome/css/line-awesome.css";
// @import "dropzone/dist/dropzone.css";
@import "@vueform/multiselect/themes/default.css";
// @import "prism-themes/themes/prism-shades-of-purple.css";
// @import "element-plus/dist/index.css";

// Main demo style scss
// @import "assets/fonticon/fonticon.css";
// @import "assets/keenicons/duotone/style.css";
// @import "assets/keenicons/outline/style.css";
// @import "assets/keenicons/solid/style.css";
// @import "assets/sass/element-ui.dark";
// @import "assets/sass/plugins";
// @import "assets/sass/style";

#app {
  display: contents;
}
</style>
