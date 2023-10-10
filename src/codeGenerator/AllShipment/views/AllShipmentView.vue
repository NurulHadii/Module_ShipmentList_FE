<template>
    <div class="card mt-4">
        <div class="card-header border-0 pt-6">
            <!--begin::Card title-->
            <div class="card-title"></div>
            <!--begin::Card title-->
        </div>
        <div class="card-body pt-0">
            <dx-data-grid :id="ui_element_key"
                          :data-source="gridDataTemplate"
                          :editing="editing"
                          @saving="onSaving"
                          @saved="toogleUseNavigation"
                          @exporting="onExporting"
                          key-expr="id">
                
            
<DxColumn data-field="order_no"/>
<DxColumn data-field="carrier_name"/>
<DxColumn data-field="total_qty"/>
<DxColumn data-field="shipping_date"/>
<DxColumn data-field="shipper_name"/>
<DxColumn data-field="consignee_name"/>
<DxColumn data-field="workflow_status"/>

            </dx-data-grid>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  DxDataGrid,
  DxButton,
  DxColumn,
  DxScrolling,
  DxPager,
  DxPaging,
  DxLookup,
  DxMasterDetail
} from "devextreme-vue/data-grid";
import type { DxDataGridTypes } from "devextreme-vue/data-grid";
import { useRouter, useRoute } from "vue-router";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { exportDataGrid as exportDataGridToXLSX } from "devextreme/excel_exporter";
import { jsPDF as JsPdf } from "jspdf";
import { saveAs } from "file-saver-es";
import { Workbook } from "exceljs";
import { AllShipmentStore } from "@/codeGenerator/order_ocean_v1/stores/AllShipmentStore";
import AllShipmentService from "@/codeGenerator/order_ocean_v1/services/AllShipmentService.ts";
import { createStore } from "devextreme-aspnet-data-nojquery";
import JwtService from "@/core/services/JwtService";
let useNavigation = true;

interface Props {
  projectId: number | null;
  featureId: number | null;
}
const props = defineProps<Props>();

// Template Grid
const gridDataTemplate = ref(null);
const entity = ref("order_ocean_v1");
const ui_element_key = ref("order_ocean_v1-grid");


const editing = {
  mode: "batch",
  allowUpdating: true,
  allowAdding: true,
  allowDeleting: true,
};


const onSaving = async (e) => {
    e.cancel = true;
    if (e.changes.length) {
        e.promise = await AllShipmentService.ProcessBatchRequest("Default", e.changes, e.component);
    }
};

const loadDefaultOptionGrid = async () => {
gridDataTemplate.value = await AllShipmentStore();

  console.log("gridDataTemplate.value", gridDataTemplate.value);
};

loadDefaultOptionGrid();

const onExporting = (e: DxDataGridTypes.ExportingEvent) => {
  if (e.format === "pdf") {
    const doc = new JsPdf();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: e.component,
    }).then(() => {
      doc.save(entity.value + ".pdf");
    });
  } else {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(entity.value);
    exportDataGridToXLSX({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(
          new Blob([buffer], {
            type: "application/octet-stream",
          }),
          entity.value + ".xlsx"
        );
      });
    });
    e.cancel = true;
  }
};


const toogleUseNavigation = () => {
  useNavigation = !useNavigation;
};
</script>