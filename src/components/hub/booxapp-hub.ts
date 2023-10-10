// import { HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
// import { createApp } from "vue";

// const BooxAppHub = {
//   install(x) {

//     const booxAppHub = new Vue() 
//     // every component will use this.$questionHub to access the event bus
//     x.prototype.$booxAppHub = booxAppHub;

//     const connection = new HubConnectionBuilder()
//       .withUrl(`${import.meta.env.VITE_APP_BOOXAPP_HUB}booxAppHub`) 
//       .configureLogging(LogLevel.Information)
//       .build();

//     // if connection closed, reopen it
//     let startedPromise = null;
//     function start() {
//       startedPromise = connection.start().catch(err => {
//         return new Promise((resolve, reject) =>
//           setTimeout(
//             () =>
//               start()
//                 .then(resolve)
//                 .catch(reject),
//             5000
//           )
//         );
//       });
//       return startedPromise;
//     }

//     connection.onclose(() => start());

//     start();
//   }
// };

// export default BooxAppHub;
import { HubConnection, HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
import type { App } from "vue";

/**
 * @description service to call HTTP request via Axios
 */
class BooxAppHub {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;  
  public static connection : HubConnection; 
  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    this.vueInstance = app;
    this.connection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_APP_BOOXAPP_HUB}booxAppHub`) 
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.onclose(() => this.start());

    this.start();

  }

  private static start() {
        // if connection closed, reopen it
    let startedPromise = null;  
    startedPromise = this.connection.start().catch(err => {
      return new Promise((resolve, reject) =>
        setTimeout(
          () =>
            this.start()
              .then(resolve)
              .catch(reject),
          5000
        )
      );
    });
    return startedPromise;
  }

}

export default BooxAppHub;
