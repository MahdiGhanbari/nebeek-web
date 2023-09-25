<template>
    <span>
        <span v-if="editable" :class="{editable: editable}">
            <i @mouseover="mouseOver = i" @mouseout="mouseOver = -1" @click="select(i)" v-for="i in 5" 
                    class="material-icons stars">{{ getStarType(i) }}</i> 
        </span>
        <span v-else>
            <i v-for="i in 5" class="material-icons">{{ getStarType(i) }}</i> 
        </span>
    </span>
</template>
<script>
export default {
    props:['value', 'editable'],
    data(){
        return {
            mouseOver: -1
        }
    },
    methods: {
        getStarType(i) {
            let fill = this.mouseOver != -1 ? this.mouseOver : this.value;
            if (i <= fill)
               return 'star';
            return 'star_border';
        },
        select(i) {
            if (this.editable) {
                this.$emit('input', i);
            }
        }
    }
}
</script>
<style>
.editable {
    cursor: pointer;
}
.stars {
    font-size: 17px;
}
</style>

