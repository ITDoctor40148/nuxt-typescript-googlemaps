<template>
  <div>
    <!-- <ag-grid-vue
      style="width: 100%; height: calc(100vh - 56px)"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :defaultColumnDefs="defaultColumnDefs"
      :pagination="!Object.keys(getMarker).length"
      :paginationAutoPageSize="true"
      :rowData="rowData"
    >
    </ag-grid-vue> -->
    <h2 class="text-center">
      <nuxt-link :to="{ hash: getMarker.countryAndTerritory }">List</nuxt-link>
    </h2>
    <b-table
      responsive
      striped
      borderless
      hover
      :busy.sync="loading"
      :items="fetch"
      :fields="columnDefs"
      :per-page="shownCount"
      :current-page="currentPage"
      :tbody-tr-class="rowClass"
      :tbody-tr-attr="rowId"
      class="position-relative"
    ></b-table>
    <div
      v-if="!Object.keys(getMarker).length"
      class="d-flex justify-content-center"
    >
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="25"
        class="my-auto"
      ></b-pagination>
      <b-dropdown
        :text="shownCount.toString()"
        variant="outline-primary"
        class="m-2"
      >
        <b-dropdown-item
          v-for="p in perPage"
          :key="p"
          @click="shownCount = p"
          >{{ p }}</b-dropdown-item
        >
      </b-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { Marker } from "@/@types/position";

const marker = namespace("modules/marker");

@Component({
  components: {},
})
export default class Grid extends Vue {
  private rows = 100000;
  private currentPage = 1;
  private perPage = [25, 50, 100];
  private shownCount = this.perPage[0];
  private loading = false;
  private columnDefs = [
    { key: "dateReported", sortable: true },
    { key: "day", sortable: true },
    { key: "month", sortable: true },
    { key: "year", sortable: true },
    { key: "cases", sortable: true },
    { key: "deaths", sortable: true },
    { key: "countryAndTerritory", sortable: true },
    { key: "countryTerritoryCode", sortable: true },
    { key: "cumulativeNumberFor14DaysPer100000", sortable: true },
    { key: "lat", sortable: true },
    { key: "lng", sortable: true },
  ];

  @marker.Getter
  public getMarker!: Marker;

  mounted() {
    if (Object.keys(this.getMarker).length)
      setTimeout(
        () =>
          this.$router.push({
            hash: this.getMarker.countryAndTerritory,
          }),
        1500
      );
  }

  public async fetch(ctx: {
    sortBy: string;
    sortDesc: string;
  }): Promise<Marker[]> {
    this.loading = true;
    const urlTmp = `/api/get-data?code=lVaq5edaxcRSjG5fvbbp/tUOH9URt4Q5sA5MfMOZ4/Y1qpBQqdYSHg==`;
    let url = "";

    if (Object.keys(this.getMarker).length) {
      url = urlTmp;
      this.columnDefs.map(
        (column: { key: string; sortable: boolean }) =>
          (column.sortable = false)
      );
    } else {
      url = `${urlTmp}&page=${this.currentPage}&pageSize=${
        this.shownCount
      }&orderBy=${ctx.sortBy}:${ctx.sortDesc ? "desc" : "asc"}`;
    }

    try {
      const res: Marker[] = await this.$axios.$get(url);
      this.loading = false;
      return res;
    } catch (err) {
      console.log(err);
      this.loading = false;
      return [];
    }
  }

  public rowClass(item: Marker, type: string) {
    return Object.keys(this.getMarker).length &&
      this.getMarker.countryAndTerritory === item.countryAndTerritory
      ? "table-success"
      : "";
  }

  public rowId(item: Marker, type: string) {
    return Object.keys(this.getMarker).length &&
      this.getMarker.countryAndTerritory === item.countryAndTerritory
      ? { id: item.countryAndTerritory }
      : {};
  }
}
</script>