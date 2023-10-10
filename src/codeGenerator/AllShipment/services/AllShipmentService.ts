import ApiService from "@/core/services/ApiService";

import { createStore } from 'devextreme-aspnet-data-nojquery';
import BooxAppHub from '@/components/hub/booxapp-hub';
import JwtService from "@/core/services/JwtService";

class AllShipmentService {      
    
    private static baseUrl = "order_ocean_v1";  

    private static async ProcessBatch(entity : string, param : object) {     
        ApiService.setHeader();
        return (await ApiService.post(this.baseUrl + "/Batch/" + entity , param));
    }

    public static async ProcessBatchRequest(entity : string, changes, component) {
        await this.sendBatchRequest(entity, changes);
        await component.refresh(true);
        component.cancelEditData();
      
        BooxAppHub.connection.invoke("EventUpdate", entity + "_Batch")
            .then(() => {
              console.log(entity + "Batch");    
        });
      }
      
      private static async sendBatchRequest(entity : string, changes) {
        const result = await this.ProcessBatch(entity, changes);
      }
    
}

export default AllShipmentService;