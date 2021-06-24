import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { Marker } from "~/@types/position";

@Module
class History extends VuexModule {
  public marker: Marker = {} as Marker;

  @Mutation
  public setLastMarker(newMarker: Marker): void {
    localStorage.setItem("marker", JSON.stringify(newMarker));
    this.marker = newMarker;
  }

  get getMarker(): Marker {
    return Object.keys(this.marker).length
      ? this.marker
      : JSON.parse(localStorage.getItem("marker") ?? "{}");
  }
}
export default History;
