<template>
  <Page class="page">
    
    <StackLayout>
      <Image src="~/assets/images/TazzieBot.png"/>
    <TextView :text="device_token"></TextView>
    <GridLayout rows="*,*,*" columns="*,*,*">
      <button @tap="GoTo('/signals')" row="0" col="0">Signals</button>
      <button row="1" col="0">Click me</button>
      <button row="2" col="0">Click me</button>
      <button row="0" col="1">Click me</button>
      <button row="1" col="1">Click me</button>
      <button row="2" col="1">Click me</button>
      <button row="0" col="2">Click me</button>
      <button row="1" col="2">Click me</button>
      <button row="2" col="2">Click me</button>
    </GridLayout>
    </StackLayout>
  </Page>
</template>

<script>
export default {
  mounted() {},
  methods: {
    GoTo(path) {
      this.$feedback.success({
        title: "Going to page",
        duration: 4000,
        message: "We going to the page"
      });
      this.$router.push(path);
    }
  }
};
</script>

