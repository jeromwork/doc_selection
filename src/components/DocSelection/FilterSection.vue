<template>
    <v-row >
        <v-col cols="12"
               sm="12"
               md="3"
               v-for="group in arrGroupTags" :key="group.id"
        >
            <v-select
                    v-if="group.type*1 == 3 || group.type*1 == 5"
                    class="pa-2"
                    :items="group.tags"
                    item-value="id"
                    :label="group.title"
                    :outlined="true"
                    @change="setFilter($event, group.name)"
                    :clearable="true"
                    @click:clear="setFilter($event, group.name)"
            ></v-select>
            <v-autocomplete
                    v-else-if="group.type*1 == 4"
                    class="pa-2"
                    hide-selected
                    multiple
                    outlined
                    small-chips
                    :items="group.tags"
                    item-value="id"
                    :deletable-chips="true"
                    :auto-select-first="true"
                    :menu-props="{ offsetY: true, }"
                    :hide-no-data="true"
                    :label="group.title"
                    @change="setFilter($event, group.name)"
                    :clearable="true"
            ></v-autocomplete>


        </v-col>
        <v-col cols="12"
               sm="12"
               md="3"

        >
            <v-text-field
                    class="pa-2"
                    label="Возраст пациента"
                    outlined
                    @change="setFilter($event, 'age')"
            ></v-text-field>
        </v-col>
        <v-col cols="12"
               sm="12"
               md="12"

        >
            <v-autocomplete
                    class="pa-2"
                    hide-selected
                    multiple
                    outlined
                    small-chips
                    :items="filials"
                    :deletable-chips="true"
                    :auto-select-first="true"
                    :menu-props="{ offsetY: true, }"
                    :hide-no-data="true"
                    label="Клиники"
                    @change="setFilter($event, 'filials')"
            ></v-autocomplete>
        </v-col>
    </v-row>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: 'FilterSection',
    methods: {
        setFilter(e, name) {
            this.$store.commit('docSelection/SET_FILTERS', {name: name, data: e});
        },
    },
//====================================================================
    computed:{
        ...mapGetters({
            getFilials:'docSelection/getFilials'
            ,getArrGroupTags:'docSelection/getArrGroupTags'
        }),

        arrGroupTags : {
            get(){
                return this.getArrGroupTags;
            },
        },
        filials : {
            get(){
                let listFilials = [];
                for (let i in this.getFilials) {
                    listFilials.push({value:this.getFilials[i]['id']*1, text:this.getFilials[i]['title']});
                }
                //console.log(listFilials)
                return listFilials;
            },
        },
    }
}

</script>