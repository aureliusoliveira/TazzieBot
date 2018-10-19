<template>
  <Page class="page">
    <GridLayout rows="auto,*">
      <DockLayout row="0" stretchLastChild="false" backgroundColor="#3c495e">
        <Label text="top" dock="top" height="40" backgroundColor="#289062" />
      </DockLayout>
      <ScrollView row="1" v-if="selectedSignal != null">
        <CardView margin="2" class="m-y-5" elevation="25" radius="10" shadowOffsetHeight="10" shadowOpacity="0.5" shadowRadius="50">
          <GridLayout :class="{'green-light-bg':selectedSignal.type == 'BUY','red-light-bg':selectedSignal.type == 'SELL'}" class="p-y-10" rows="auto,auto,auto,auto,auto,auto" columns="auto,*,*,auto,auto">
            <!-- Row 1 -->
            <Ripple row="0" col="0" rippleColor="#9c27b0" borderRadius="30">
              <Label fontSize="35%" @tap="onSignalTap(null)" class="mdi m-5 black-text waves-effect" :text="'mdi-close' | fonticon"></Label>
            </Ripple>
            <Label fontSize="20%" colSpan="2" fontWeight="bold" row="0" col="1" verticalAlignment="center" textAlignment="center" class="mdi m-5 red-bg" :text="('mdi-trending-up' | + fonticon) + ' USD/ZAR'"></Label>
            <Label fontSize="20%" fontWeight="bold" row="0" col="3" verticalAlignment="center" textAlignment="center" class="mdi m-5 red-bg" :text="(selectedSignal.type =='BUY' ? 'mdi-trending-up' :'mdi-trending-down') | fonticon"></Label>
            <Label fontSize="15%" fontWeight="bold" row="0" col="4" verticalAlignment="center" textAlignment="center" class="mdi m-5 red-bg" :text="selectedSignal.type"></Label>
  
            <!-- Row 2 -->
            <Ripple row="1" col="0" rippleColor="#010202" borderRadius="100%">
              <Label fontSize="35%" borderRadius="100%" class="mdi m-5 black-text" :text="'mdi-person-outline' | fonticon"></Label>
            </Ripple>
            <Label row="1" col="3" colSpan="2" class="black-text" verticalAlignment="center" textAlignment="right" text="TP : 3010"></Label>
  
            <!-- Row 3 -->
            <Progress row="2" col="1" class="m-x-30" verticalAlignment="top" textAlignment="center" rowSpan="2" colSpan="2" :value="45" />
            <Label row="2" col="3" colSpan="2" class="black-text" verticalAlignment="center" textAlignment="right" text="Entry : 3001"></Label>
  
            <!-- Row 4 -->
            <Ripple row="3" col="0" verticalAlignment="bottom" rippleColor="#14b053" borderRadius="30">
              <Label fontSize="35%" style="color:transparent" verticalAlignment="bottom" class="mdi m-5 black-text" :text="'mdi-share' | fonticon"></Label>
            </Ripple>
            <Label row="3" col="3" colSpan="2" class="black-text" verticalAlignment="center" textAlignment="right" text="SL : 1291"></Label>
  
            <!-- Row 5 -->
            <Ripple row="4" col="0" verticalAlignment="bottom" rippleColor="#14b053" borderRadius="30">
              <Label fontSize="35%" verticalAlignment="bottom" class="mdi m-5 black-text" :text="'mdi-share' | fonticon"></Label>
            </Ripple>
            <Label row="4" col="1" rowSpan="2" colSpan="2" class="black-text" verticalAlignment="bottom" textAlignment="center" text="4 hours ago"></Label>
            <Label row="4" col="3" colSpan="2" class="black-text" verticalAlignment="bottom" textAlignment="right" text="By Joe"></Label>
          </GridLayout>
        </CardView>
      </ScrollView>
        <ListView row="1" v-if="selectedSignal == null" itemInsertAnimation="Slide" @itemTap="onSignalTap(signal)" borderRightWidth="2px" borderRightColor="transparent" for="signal in filteredSignals">
          <v-template>
            <Ripple>
              <CardView margin="2" class="m-y-5" elevation="25" radius="10" shadowOffsetHeight="10" shadowOpacity="0.5" shadowRadius="50">
                <GridLayout :class="{'green-light-bg':signal.type == 'BUY','red-light-bg':signal.type == 'SELL'}" class="p-y-10" rows="auto,auto,auto,auto,auto,auto" columns="auto,*,*,auto,auto">
                  <!-- Row 1 -->
                  <Ripple row="0" col="0" rippleColor="#9c27b0" borderRadius="30">
                    <Label fontSize="35%" @tap="onSignalTap(signal)" class="mdi m-5 black-text waves-effect" :text="'mdi-fullscreen' | fonticon"></Label>
                  </Ripple>
                  <Label fontSize="20%" colSpan="2" fontWeight="bold" row="0" col="1" verticalAlignment="center" textAlignment="center" class="mdi m-5 red-bg" :text="('mdi-trending-up' | + fonticon) + ' USD/ZAR'"></Label>
                  <Label fontSize="20%" fontWeight="bold" row="0" col="3" verticalAlignment="center" textAlignment="center" class="mdi m-5 red-bg" :text="(signal.type =='BUY' ? 'mdi-trending-up' :'mdi-trending-down') | fonticon"></Label>
                  <Label fontSize="15%" fontWeight="bold" row="0" col="4" verticalAlignment="center" textAlignment="center" class="mdi m-5 red-bg" :text="signal.type"></Label>
  
                  <!-- Row 2 -->
                  <Ripple row="1" col="0" rippleColor="#010202" borderRadius="100%">
                    <Label fontSize="35%" borderRadius="100%" class="mdi m-5 black-text" :text="'mdi-person-outline' | fonticon"></Label>
                  </Ripple>
                  <Label row="1" col="3" colSpan="2" class="black-text" verticalAlignment="center" textAlignment="right" text="TP : 3010"></Label>
  
                  <!-- Row 3 -->
                  <Progress row="2" col="1" class="m-x-30" verticalAlignment="top" textAlignment="center" rowSpan="2" colSpan="2" :value="45" />
                  <Label row="2" col="3" colSpan="2" class="black-text" verticalAlignment="center" textAlignment="right" text="Entry : 3001"></Label>
  
                  <!-- Row 4 -->
                  <Ripple row="3" col="0" verticalAlignment="bottom" rippleColor="#14b053" borderRadius="30">
                    <Label fontSize="35%" style="color:transparent" verticalAlignment="bottom" class="mdi m-5 black-text" :text="'mdi-share' | fonticon"></Label>
                  </Ripple>
                  <Label row="3" col="3" colSpan="2" class="black-text" verticalAlignment="center" textAlignment="right" text="SL : 1291"></Label>
  
                  <!-- Row 5 -->
                  <Ripple row="4" col="0" verticalAlignment="bottom" rippleColor="#14b053" borderRadius="30">
                    <Label fontSize="35%" verticalAlignment="bottom" class="mdi m-5 black-text" :text="'mdi-share' | fonticon"></Label>
                  </Ripple>
                  <Label row="4" col="1" rowSpan="2" colSpan="2" class="black-text" verticalAlignment="bottom" textAlignment="center" text="4 hours ago"></Label>
                  <Label row="4" col="3" colSpan="2" class="black-text" verticalAlignment="bottom" textAlignment="right" text="By Joe"></Label>
                </GridLayout>
              </CardView>
            </Ripple>
          </v-template>
        </ListView>
    </GridLayout>
  </Page>
</template>

<script>
  export default {
    data() {
      return {
        filteredSignals: [{
          type: "BUY"
        }],
        selectedSignal: null
      };
    },
    computed: {},
    mounted() {
      setInterval(() => {
        var type = Math.random() * 10 > 5 ? "SELL" : "BUY";
        this.filteredSignals.push({
          type: type
        });
      }, 500);
    },
    methods: {
      onSignalTap(signal) {
        this.selectedSignal = signal;
      },
      onSignalSwapped(e) {
        this.$feedback.success({
          title: "Swipped",
          message: e.direction
        });
      }
    }
  };
</script>

