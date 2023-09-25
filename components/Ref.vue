<template>
    <div>
        <span>{{label}}</span>
        <input v-if="editable" :value="getName" type="text" :style="{'max-width': maxLength + 'px'}">
        <entity v-else v-model="entity" view-mode="small" class="inline-entity"></entity>
    </div>
</template>
<script>
import Entity from '~/components/Entity.vue';
import db from '~/plugins/db';
import {mapState} from 'vuex';

    export default {
        props: ['value', 'editable', 'type', 'label', 'maxLength'],
        data() {
            return {
                entity: {}
            }
        },
        methods: {
            async loadEntity() {
                let res = await db.find(this.value);
                this.entity = res ? res : {names:[{fa: "-", en: "-"}]}
            }
        },
        computed: {
            getName() {
                if (!this.entity || !this.entity.names || !this.entity.names[0])
                    return "-";
                // TODO: replace with alt local
                return this.entity.names[0][this.local] || "-";
            },
            ...mapState({
                local: state => state.lingual
            }),
        },
        created() {
            this.loadEntity();
        },
        components: {
            Entity
        }
    }
</script>
<style scoped>
input {
    margin: 15px 5px 15px 0 ;
    display: inline-block;
    width: 100%;
}
.inline-entity {
    display: inline-block;
}
</style>
