
import { createStore } from 'devextreme-aspnet-data-nojquery';
import BooxAppHub from '@/components/hub/booxapp-hub';
import JwtService from "@/core/services/JwtService";

export const AllShipmentStore = () =>  createStore({
    key: 'Id',
    loadUrl: import.meta.env.VITE_APP_BOOXAPP_API_URL + "/order_ocean_v1" + "/GetAll",
    onBeforeSend: (method, ajaxOptions) => {
      ajaxOptions.xhrFields = { withCredentials: false };
      ajaxOptions.headers = {  
        "Authorization": 'Bearer ' + JwtService.getToken(),
        "Tenant": JwtService.getTenant()
     } 
    },    
  });