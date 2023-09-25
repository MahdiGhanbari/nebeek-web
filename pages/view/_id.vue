<template>
    <div v-if="entity" class="container">
        <entity v-if="!entity.removed" v-model="entity" :image-width="200" viewMode="full" :editable="isEditable"></entity>
        <div v-else class="error">
            <nuxt-link class="symbol material-icons box" to="/"> not_interested </nuxt-link>
            <div class="type">
                <string :value="entity.type.name"></string>
            </div>
            <div class="name">
                <string  :value="entity.name"></string>
            </div>
            <div class="message">
                <string :value="{'fa': 'حذف شده است', 'en': 'has been deleted'}"></string>
            </div>
        </div>
    </div>
</template>
<script>
import String from '~/components/String.vue';
import Entity from '~/components/Entity.vue';
import metaTags from '~/plugins/metaTags';
import db from '~/plugins/db';
import {mapState} from 'vuex'; 

export default {
    async asyncData(context) {
        let entity = await db.find(context.params.id);
        return {
            entity: entity ? entity : null
        };
    },
    head() {
        // var ret = metaTags(this.$route, this.entity, this.local);
        // let arrStr = ['{"@context": "http://schema.org",\n"bookFormat": "EBook"'];
        // for(let field in this.entity) {
        //     switch(field) {
        //         case 'frontImage': 
        //             let imagePath = this.entity.frontImage.path;
        //             ret.meta.push(
        //                 {property: "og:image", content: imagePath},
        //                 {itemprop: "image", content: imagePath},
        //                 {name: "twitter:image:src", content: imagePath}
        //             );
        //             arrStr.push('"image": "' + imagePath + '"');
        //         break;
        //         case 'abstract': 
        //             let description = this.entity.abstract[this.local];
        //             description = description !='' ? description : this.entity.abstract['fa'];
        //             ret['description'] = description;
        //             ret.meta.push(
        //                 {hid: 'description', name: 'description', content: description},
        //                 {property: "og:description", content: description},
        //                 {itemprop: "description", content: description},
        //                 {name: "twitter:description", content: description}
        //             );
        //         break;
        //         case 'actualOwner': 
        //             let author = this.entity.actualOwner.names[0][this.local];
        //             ret.meta.push(
        //                 { property: "article:author", content: author },
        //             );
        //         break;
        //         case 'type':
        //             arrStr.push('"@type":' + '"' + this.entity.type + '"');
        //         break;
        //         // case 'creation':
        //         //     for (let create of this.entity.creation) {
        //         //         if (create.type == 'Publish' && create.actor) {
        //         //             arrStr.push('"publisher": {'+
        //         //                 '"@type": "'+ create.actor.type +'",' +
        //         //                 '"name": "'+ create.actor.names[0][this.local] +'"' +
        //         //             '}');
        //         //         }
        //         //     }
        //         // break;
        //         case 'names': 
        //             for (let name of this.entity.names) {
        //                 arrStr.push('"name": "' + name[this.local] + '"');
        //             }
        //         break;
        //         case 'reviews':
        //             let rewArray = this.entity.reviews, total = 0;
        //             for(let i = 0 ; i < rewArray.length ; i++ ) 
        //                 total += rewArray[i].value;
        //             arrStr.push('"aggregateRating": {'+
        //                         '"@type": "AggregateRating",'+
        //                         '"reviewCount": "' + rewArray.length + '",' +
        //                         '"ratingValue": "' + Math.floor(total/rewArray.length) + '"' +
        //                         '}');  
        //         break;
        //     }
        // }
        // let script = arrStr.toString() + '}';
        // ret.script.push({ innerHTML: script, type: 'application/ld+json' })
        //return ret;
        return {};
    },
    computed: {
        ...mapState({
            local: state => state.lingual,
            isLoggedIn: state => state.isLoggedIn,
            user: state => state.user
        }),
        isEditable() {
            if(this.isLoggedIn) {
                let id = this.entity.owner ? this.entity.owner.id : this.entity.id;
                return this.user.id == id;
            }
            return false;
        }
    },
    components: {
        Entity,
        String
    }
}
</script>

<style scoped>
.error {
    display: inherit;
    text-align: center;
    line-height: 40px;
}
.symbol {
    font-size: 130px;
    color: gray;
    background: #f1f1f1;
    border-radius: 50%;
}
.symbol:hover {box-shadow: 0px 4px 5px 1px grey;}
.type {font-size: 25px; color: gray;}
.name {font-size: 30px;color:#111;}
.message {font-size: 20px; color: #ef5252;}
</style>
