<template>
  <Layout class="text-center container-fluid pt-5">

    <hr>

    <div class="plate-wrapper">
      <div class="plate rounded">
        <div class="out rounded">
          <div class="in rounded">
            <div class="in-body pt-3">
              <b>Work in Progress</b>
              <p>...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr>

    <div>
      <div></div>
      <div class="progress-bar-wrapper p-1 rounded">
        <b-progress :max="max" class="border ">
          <b-progress-bar variant="success" :value="values[0]" animated show-progress></b-progress-bar>
          <b-progress-bar variant="secondary" :value="values[1]" striped show-progress></b-progress-bar>
        </b-progress>
      </div>
    </div>

    <div class="my-card">
      <div class="picture"></div>
      <div class="info"></div>
    </div>

  </Layout>
</template>

<page-query>
</page-query>

<script>
export default {
  metaInfo: {
    title: 'working in progress!'
  },
  data() {
    return {
      values: [25, 75],
      max: 100
    }
  }
}
</script>

<style lang="scss">

.plate-wrapper {
  display: flex;
  justify-content: center;

  .plate {
    z-index: 1;
    position: relative;
    background-color: #eeee00;
    width: 150px;
    aspect-ratio: 1;
    border: 2px solid black;
    transform: rotate(45deg);

    .out {
      aspect-ratio: inherit;
    }

    .in {
      position: absolute;
      padding: 20px;
      aspect-ratio: inherit;
      transform: rotate(-45deg);
    }

  }
}

.progress-bar-wrapper {
  border: solid 3px #1d1d1d;
}

.home-links a {
  margin-right: 1rem;
}
</style>
