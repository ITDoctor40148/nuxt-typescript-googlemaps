<template>
  <div>
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
    <div class="m-3">
      <b-form @submit="onSubmit">
        <label for="datepicker">Choose a date</label>
        <b-form-datepicker
          id="datepicker"
          v-model="date"
          class="mb-2"
        ></b-form-datepicker>
        <label for="cases">Enter a cases</label>
        <b-form-input id="cases" type="number" v-model="cases"></b-form-input>
        <label for="deaths">Enter a deaths</label>
        <b-form-input id="deaths" type="number" v-model="deaths"></b-form-input>
        <label for="cumulativeNumberFor14DaysPer100000">
          Enter a cumulativeNumberFor14DaysPer100000
        </label>
        <b-form-input
          id="cumulativeNumberFor14DaysPer100000"
          type="number"
          v-model="cumulativeNumberFor14DaysPer100000"
        ></b-form-input>
        <label for="countrypicker">Choose a country</label>
        <b-form-select
          id="countrypicker"
          v-model="country"
          :options="options"
          :select-size="4"
        ></b-form-select>
        <b-button
          block
          type="submit"
          variant="outline-primary"
          :disabled="!Object.keys(country).length || !date || loading"
          class="mt-2"
        >
          {{ !loading ? "Add" : "Adding..." }}
        </b-button>
      </b-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { Marker, Position, Country } from "@/@types/position";

import { COUNTRIES } from "@/constants/country";

const marker = namespace("modules/marker");

@Component({
  components: {},
})
export default class Home extends Vue {
  private markers: Marker[] = [];
  private center: Position = { lat: 0, lng: 0 };

  private loading = false;

  private country: Country = {} as Country;
  private date: string = "";
  private cumulativeNumberFor14DaysPer100000 = 0;
  private cases = 0;
  private deaths = 0;
  // Convert countries' information to dropdown list
  private options = COUNTRIES.map((c) => ({
    value: c,
    text: c.countryAndTerritory,
  }));

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
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.loading = true;
    const dateReported = new Date(this.date);
    const data: Marker = {
      dateReported,
      day: dateReported.getDay(),
      month: dateReported.getMonth(),
      year: dateReported.getFullYear(),
      cases: this.cases,
      deaths: this.deaths,
      cumulativeNumberFor14DaysPer100000:
        this.cumulativeNumberFor14DaysPer100000,
      ...this.country,
    };
    this.$axios
      .$post(
        `/api/get-data?code=lVaq5edaxcRSjG5fvbbp/tUOH9URt4Q5sA5MfMOZ4/Y1qpBQqdYSHg==`,
        data
      )
      .then((res) => {
        this.loading = false;
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
