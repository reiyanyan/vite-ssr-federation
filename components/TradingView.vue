<template>
  <div class="tradingview">
    <div v-if="isChartReady" class="tradingview__toolbar">
      <div class="tradingview__toolbar__resolutions">
        <p
          v-for="item in resolutions"
          :key="item.resolution"
          :class="{ active: item.resolution == activeResolution }"
          @click="handleResolution(item.resolution)"
        >
          {{ item.title ?? item.text }}
        </p>
      </div>
      <div class="tradingview__toolbar__actions">
        <img src="#" alt="fullscreen" @click="handleFullscreen" />
      </div>
    </div>
    <div ref="tradingview__wrapper" class="tradingview__wrapper">
      <div id="tradingview__chart" ref="tradingview__chart"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from "vue";
import {
  AvailableSaveloadVersions,
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  LanguageCode,
  ResolutionString,
  TimeFrameItem,
  widget,
  ThemeName,
} from "../public/charting_library";

export default defineComponent({
  props: {
    symbol: {
      default: "BTC/USDT",
      type: String,
    },
    interval: {
      default: "240",
      type: String as unknown as () => ResolutionString,
    },
    datafeedUrl: {
      default: `https://api.vonix.id/v1/market/tradingview`,
      type: String,
    },
    libraryPath: {
      default: "/charting_library/",
      type: String,
    },
    chartsStorageUrl: {
      default: "https://saveload.tradingview.com",
      type: String,
    },
    chartsStorageApiVersion: {
      default: "1.1",
      type: String as () => AvailableSaveloadVersions,
    },
    clientId: {
      default: "tradingview.com",
      type: String,
    },
    userId: {
      default: "public_user_id",
      type: String,
    },
    fullscreen: {
      default: false,
      type: Boolean,
    },
    autosize: {
      default: true,
      type: Boolean,
    },
    studiesOverrides: {
      default: () => {
        return {};
      },
      type: Object,
    },
  },
  setup(props) {
    const activeResolution = ref<ResolutionString>();
    const isChartReady = ref<boolean>(false);
    const selectedChart = ref({
      name: "Candle",
      code: 1,
      icon: "chart_candle",
    });
    const chartTypes = [
      { name: "Bar", code: 0, icon: "chart_bar" },
      { name: "Candle", code: 1, icon: "chart_baseline" },
      { name: "Line", code: 2, icon: "chart_line" },
      { name: "Heikin-Ashi", code: 8, icon: "chart_haikin-ashi" },
    ];

    let myWidget: IChartingLibraryWidget;
    const tradingview__wrapper = ref<HTMLElement | string>("");
    const resolutions: Array<TimeFrameItem> = [
      { text: "1m", resolution: "1", description: "1 Minute" },
      { text: "5m", resolution: "5", description: "5 Minutes" },
      { text: "15m", resolution: "15", description: "15 Minutes" },
      { text: "30m", resolution: "30", description: "30 Minutes" },
      { text: "1h", resolution: "60", description: "1 Hour" },
      { text: "4h", resolution: "240", description: "4 Hours" },
      { text: "1d", resolution: "1D", description: "1 Day" },
      { text: "1w", resolution: "1W", description: "1 Week" },
      //{ text: "1M", resolution: "1M", description: "1 Month" },
    ] as Array<TimeFrameItem>;

    const getReady = () => {
      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: props.symbol,
        // BEWARE: no trailing slash is expected in feed URL
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
          props.datafeedUrl
        ),
        interval: props.interval,
        container: tradingview__wrapper.value,
        library_path: props.libraryPath,
        locale: "en" as LanguageCode,
        // disabled_features: ["use_localstorage_for_settings", "header_widget", "timeframes_toolbar"],
        disabled_features: [
          // "use_localstorage_for_settings",
          "header_compare",
          "header_symbol_search",
        ],
        // enabled_features: ["hide_left_toolbar_by_default"],
        // auto_save_delay: 5,
        charts_storage_url: props.chartsStorageUrl,
        charts_storage_api_version: props.chartsStorageApiVersion,
        client_id: props.clientId,
        user_id: props.userId,
        fullscreen: props.fullscreen,
        autosize: props.autosize,
        studies_overrides: props.studiesOverrides,
        timezone: "Asia/Jakarta",
        //debug: true,
        // theme: theme,
      };
      //   console.log(widgetOptions);
      myWidget = new widget(widgetOptions);

      myWidget.onChartReady(() => {
        isChartReady.value = true;
        activeResolution.value = myWidget.activeChart().resolution();
      });
    };

    watch(
      () => selectedChart.value,
      (val) => {
        myWidget.activeChart().setChartType(val.code);
      },
      {
        deep: true,
      }
    );
    watch(
      () => props.symbol,
      (val) => {
        if (isChartReady.value) {
          myWidget.activeChart().setSymbol(val);
        }
      }
    );

    watch(
      () => isChartReady.value,
      () => {
        myWidget.activeChart().setSymbol(props.symbol);
      }
    );

    // watch(isDark, () => {
    //   if (isDark.value) {
    //     theme = "Dark";
    //   } else {
    //     theme = "Light";
    //   }
    //   myWidget.changeTheme(theme);
    // });

    const handleResolution = (resolution: string) => {
      myWidget.activeChart().setResolution(resolution as ResolutionString);
      activeResolution.value = myWidget.activeChart().resolution();
    };

    const handleFullscreen = () =>
      (tradingview__wrapper.value as HTMLDivElement).requestFullscreen();

    onMounted(() => getReady());

    onUnmounted(() => {
      if (myWidget !== null) {
        myWidget.remove();
      }
    });

    return {
      tradingview__wrapper,
      resolutions,
      handleResolution,
      activeResolution,
      isChartReady,
      handleFullscreen,
      selectedChart,
      chartTypes,
    };
  },
});
</script>
