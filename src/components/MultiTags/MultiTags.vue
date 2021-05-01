<template>
<div>
    <v-autocomplete
            hide-selected
            multiple
            outlined
            small-chips
            :value="tagsSelected"

            :items="listItems"
            :deletable-chips="true"
            :auto-select-first="true"
            :search-input.sync="searchInput"
            :menu-props="{ offsetY: true, }"
            :hide-no-data="true"
            :label="this.placeholder"
            v-on:change="onChange"
    ></v-autocomplete>
    </div>
</template>





<script>
    import axios from 'axios'
    //todo Сделать ajax подгрузку
    //сейчас все тэги загружаются при создании компонента.
    //если 800 штук плохо но терпимо
    //но если будут десятки тысяч, нужно переделывать на ajax
    export default {

        name: 'MultiTags',

        props: {
            action:{
                type: String,
                required: true,
            },
            placeholder:{
                type: String,
            },
            connector:{
                type: String,
                required: true,
            },
            include_fields:{
                type: Object,
            },
            tagsSelected: {
                type: Array,
            },
            tag:{
                type: String,
            }
        },

        components: {

        },
        data: () => ({
            items: [],
            select:[],
            info:{},
            searchInput:null,
            selected:{}
        }),



        methods: {

            async search(val){

                if(!val) {return;}
                const formData = new FormData();
                formData.append("action", this.action);
                formData.append("cors_key", '8cbd6a0c2e767862b02887a446bb34ca');
                formData.append("include_fields", JSON.stringify({'id':'value', 'fullname':'text'}));
                if(this.searchInput){
                    formData.append("search", this.searchInput);
                }

                formData.append("length", '1000');
                axios
                    .post(this.urlConnector, formData)
                    .then(response => {
                        this.info = response;


                        this.items = response.data.data;
                        //console.log(this);
                        //
                    }).catch(error => console.log(error));
            },
            async GET_ITEMS(){

                let qdata = {
                    action: this.action,
                    cors_key : '8cbd6a0c2e767862b02887a446bb34ca',
                    tag:this.tag,
                    include_fields : this.include_fields,
                    length : 1000,
                };
                axios

                    .post(this.urlConnector, qdata)
                    .then(response => {

                        if(Array.isArray(response.data.data)){
                            response.data.data.map((item) => {
                                this.items.push({text:item.text, value:item.value*1});
                            })


                        }
                        //this.items = response.data.data;



                        //this.commit('doctorSettings/FILL_DOCTOR_SETTINGS_DATA', response.data);
                    });
            },
            onChange(value){
                console.log(value);
                this.$emit('change-tags', value)
            }

        },
        updated() {
            this.selected = this.tagsSelected;
            console.log(this.tagsSelected);

        },
        created(){

                         this.GET_ITEMS();

        },

        computed:{

            listItems:{
                get(){
                    //console.log(this.items);
                    return this.items;
                },
                // set(val){        console.log(val);
                //     this.items = val;
                // },
            },
            urlConnector:{
                get(){
                    return (window.location.host === 'http://localhost:8080/')? '/assets/components/eastclinic/'+this.connector+'/connector.php': 'http://dev.eastclinic.local/assets/components/eastclinic/'+this.connector+'/connector.php'
                //return u;
                }


            },

        }


    }
</script>

<style scoped>

</style>
