<template>
  <Layout>
    <h1>Projects Created</h1>
    <div class="col-md-4">
        <p> Policy Medical </p>
        techs: <span v-for="tech in techs" :key="tech.name">{{tech.name}}</span>
    </div>

  </Layout>
</template>

<page-query>
query {
    technologies: allTechs {
        edges {
            node{
                name
            }
        }
    }
}
</page-query>

<script>
export default {
    computed: {
        techs() {
            return this.$page.technologies.edges.map(edge => edge.node) || {oloko: 'iruu'}
        }
    },
    metaInfo: {
        title: 'About us',
    }
}
</script>
