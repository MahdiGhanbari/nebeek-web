<template>
<div class="container" v-if="entity">
    <h1>ایجاد <string :value="entity.name"></string> جدید</h1>
    <div>
        <form @submit.prevent="create">
            <select v-if="entity.subtypes" v-model="subtypeId">
                <option v-for="subtype in entity.subtypes" :value="subtype.id">{{ subtype.name.fa }}</option>
            </select>
            <input v-model="name" type="text" id="name" autofocus>
            <label for="name">نام</label>
            <button class="primary" type="submit">ثبت</button>
        </form>
    </div>
</div>
</template>
<script>
import db from '~/plugins/db';
import String from '~/components/String.vue';

export default {
    middleware: 'authenticated',
    async asyncData(context) {
        let entity = await db.find('', {names: context.params.id});
        let query = context.query || {};
        return {
            owner: query.owner,
            entity: entity.data
        };
    },
    data() {
        return {
            name: '', 
            subtypeId: 0
        };
    },
    methods: {
         async create() {
            try {
                let data = await db.save({
                    // TODO: enable creating things for orgs
                    //owner: this.owner || this.$store.state.user.id,
                    names: [this.name],
                    type: this.subtypeId || this.entity.id
                });
                this.$router.push({name: 'view-id', params: {id: data.id}});
            }catch(err) {}  
        }
    },
    components: {
        String
    }
}
</script>
