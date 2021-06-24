<template>
  <GmapMap
    :center="center"
    :zoom="7"
    map-type-id="terrain"
    style="width: 100%; height: 50vh"
  >
    <GmapMarker
      :key="index"
      v-for="(m, index) in markers"
      :position="getPosition(m)"
      :title="`${m.countryAndTerritory}\n${new Date(
        m.dateReported
      ).toDateString()}\n${m.deaths}`"
      :clickable="true"
      :draggable="false"
      @click="moveToGrid(m)"
    />
  </GmapMap>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { Marker, Position } from "@/@types/position";

const marker = namespace("modules/marker");

@Component({
  components: {},
})
export default class Home extends Vue {
  private markers: Marker[] = [];
  private center: Position = { lat: 0, lng: 0 };

  @marker.Mutation
  public setLastMarker!: (m: Marker) => void;

  created(): void {
    this.$axios
      .$get(
        `/api/get-data?code=lVaq5edaxcRSjG5fvbbp/tUOH9URt4Q5sA5MfMOZ4/Y1qpBQqdYSHg==`
      )
      .then((res: Marker[]) => {
        this.markers = res;
        this.center = this.getPosition(res[0]);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public getPosition(marker: Marker): Position {
    const position: Position = {
      lat: marker.lat,
      lng: marker.lng,
    };
    return position;
  }

  public moveToGrid(marker: Marker) {
    this.setLastMarker(marker);
    this.$router.push({ path: "/grid" });
  }
}
</script>

<style></style>
