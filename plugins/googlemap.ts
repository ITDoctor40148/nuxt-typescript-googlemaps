import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDq9doX_sU-_jE9lLPU0SF2BmLuI_TY7q8",
    libraries: "places"
  }
});
