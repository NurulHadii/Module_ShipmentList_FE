import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import BooxAppHub from '@/components/hub/booxapp-hub';

export interface User {
  name: string;
  surname: string;
  username: string;
  whatsapp: string;
  email: string;
  password: string;
  api_token: string;
  refresh_token : string;
  activeTenant : string;
  extendInfo : any,
  listTenant : Array<any>,
  sessionKey  : string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());

  function setAuth(authUser: User) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    JwtService.saveToken(user.value.api_token);    
    JwtService.setSessionKey(user.value.sessionKey);
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value.password = "";
    user.value.email ="";
    user.value.surname ="";
    user.value.name ="";
    user.value.api_token ="";
    user.value.username ="";
    user.value.whatsapp ="";
    user.value.sessionKey = "";
    errors.value = [];
    JwtService.destroyToken();
    JwtService.destroyTenant();
    JwtService.destroySessionKey();
  }

  async function login(credentials: User) {
   
    // user.value.password = data.password;
    // user.value.email = data.email;
    // user.value.surname = data.surname;
    // user.value.name = data.name;
    // user.value.api_token = data.api_token;

    // isAuthenticated.value = true; 
    // errors.value = {};
    // JwtService.saveToken(user.value.api_token);
    // console.log(user.value);
    return (await ApiService.post("Authentication/login", credentials)
      .then(({ data }) => { 
        isAuthenticated.value = true; 
        errors.value = {};
        setAuth(data);
        JwtService.saveToken(user.value.api_token);
        JwtService.setTenant(user.value.activeTenant);                 
        JwtService.saveRefreshToken(user.value.refresh_token);
        JwtService.setSessionKey(user.value.sessionKey);
        BooxAppHub.connection.invoke("Connect", user.value.username)
        .then(() => {
          console.log("connected");    
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });

        console.log(user); 

      })
      .catch(({ response }) => {
        console.log(response);
        // setError(response.data.errors);
      }));
  }

  function logout() {
    BooxAppHub.connection.invoke("Disconnect", user.value.username)
    .then(() => {
      console.log("Disconnected");    
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
    
    purgeAuth();
  }

  function register(credentials: User) { 
    return ApiService.post("Authentication/register", credentials)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function forgotPassword(email: string) {
    return ApiService.post("forgot_password", email)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function verifyAuth() {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.post("Authentication/verify_token", { api_token: JwtService.getToken() })
        .then(({ data }) => {
          console.log('dataverifyToken', data);
          isAuthenticated.value = true; 
          errors.value = {};
          setAuth(data);
          JwtService.saveToken(user.value.api_token);                        
          JwtService.saveRefreshToken(user.value.refresh_token);     
          JwtService.setSessionKey(user.value.sessionKey);
          console.log(user.value);  
        })
        .catch(({ response }) => {
          if(response.status === 401) {
            ApiService.post("Authentication/refresh_token", { access_token: JwtService.getToken(),  refresh_token : JwtService.getRefreshToken()})
            .then(({ data }) => {
              isAuthenticated.value = true; 
              errors.value = {};
              setAuth(data);
              JwtService.saveToken(data.api_token);                        
              JwtService.saveRefreshToken(data.refresh_token);     
              JwtService.setSessionKey(data.sessionKey);
              console.log(user.value);  
            })
            .catch(({ response }) => {
              purgeAuth();
            });
          }else{
            // setError(response.data.errors);
           purgeAuth();
          }
         
        });
    } else {
      purgeAuth();
    }
  }

  function verifyExternalAuth(token : string) {
    // ApiService.setHeader();
    ApiService.post("Authentication/verify_token", { api_token: token })
      .then(({ data }) => {
        console.log('dataverifyToken', data);
        isAuthenticated.value = true; 
        errors.value = {};
        setAuth(data);
        JwtService.saveToken(user.value.api_token);                
        JwtService.saveRefreshToken(user.value.refresh_token);
        JwtService.setSessionKey(user.value.sessionKey);
        console.log(user.value);  
      })
      .catch(({ response }) => {
        // setError(response.data.errors);
        purgeAuth();
      });
  }

  function verifySessionKey(sessionKey : string) {
    // ApiService.setHeader();
    ApiService.get("Authentication/SessionToken?sessionKey=" + sessionKey)
      .then(({ data }) => {
        console.log('verifySessionKey', data);
        isAuthenticated.value = true; 
        errors.value = {};
        // setAuth(data);
        user.value.email =data.AuthGraph.Email;
        user.value.surname =data.AuthGraph.Username;
        user.value.name =data.AuthGraph.Username;
        user.value.api_token =data.Token;
        user.value.username =data.AuthGraph.Username;
        user.value.whatsapp =data.AuthGraph.Whatsapp;
        user.value.sessionKey = data.AuthGraph.SessionKey;

        JwtService.saveToken(user.value.api_token); 
        JwtService.saveRefreshToken(user.value.refresh_token);        
        JwtService.setSessionKey(user.value.sessionKey);
        console.log(user.value);  
      })
      .catch(({ response }) => {
        // setError(response.data.errors);
        purgeAuth();
      });
  }

  return {
    errors,
    user,
    isAuthenticated,
    login,
    logout,
    register,
    forgotPassword,
    verifyAuth,
    verifyExternalAuth,
    verifySessionKey
  };
});
