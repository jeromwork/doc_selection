<template>
    <v-row>

        <v-col cols="12"
               sm="12"
               md="12">
            <v-card
                    elevation="8"
                    outlined
            >
                <v-card-text>

                    <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation

                    >
                        <v-row no-gutters >
                            <v-col cols="12"
                                   sm="12"
                                   md="4"
                                   v-for="group in arrGroupTags" :key="group.id"
                            >

                                <v-select
                                        v-if="group.type*1 == 3"
                                        class="pa-2"
                                        :items="group.tags"
                                        item-value="id"
                                        :label="group.title"
                                        :outlined="true"
                                        @change="setFilter($event, group.name)"
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
                                        :search-input.sync="searchInput"
                                        :menu-props="{ offsetY: true, }"
                                        :hide-no-data="true"
                                        :label="group.title"
                                        @change="setFilter($event, group.name)"
                                ></v-autocomplete>

                            </v-col>

                        </v-row>


                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>


        <v-col cols="12"
               sm="12"
               md="12">
            <v-card
                    elevation="8"
                    outlined
            >
                <v-card-text>
                    <v-row>
                        <v-col
                                v-for="(clinic, index) in filialsDoctors" :key="index"
                                cols="12"
                               sm="12"
                               md="3">
                            <v-card
                                    v-if="clinic.length > 0"
                                    elevation="8"
                                    outlined
                            >
                                <v-card-title>{{getFilial(index)}}</v-card-title>
                                <v-card-text>
                                    <v-list>

                                        <v-list-item
                                                v-for="(doc, di) in clinic" :key="di"
                                                link>
                                            <v-list-item-content>
                                                <v-list-item-content>
                                                    {{getDoctor(doc.id)}}
                                                </v-list-item-content>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>

    //#1  забираются группы с сервера
    //там же забираются данные по филиалам
    //записывается в 2 массива - группы тэгов и филиалы
    //в цикле обходится массив с группами тэгов.
    //для группы смотрим какой тип (пока 3 и 4) и рендерим выбранный элемент
    //для филиалов рендерим селект отдельно, внизу


    //#2 (одновременновыбираем с #1 из сервера запрашиваем первых N докторов)
    //доктора на сервере сортируются по уровню, и выводятся сначала с самым большим уровнем
    //доктора приходят с сервера во вложенном массиве с id филиала
    //этот массив в цикле обходится и создается карточка филиала
    //во вложенном цикле - по докторам, обходим уже докторов и формируем список докторов в карточке, с указанием его суммарного уровня
    //для каждого доктора, будет значение его суммарного Level


    //выбирается первый фильтр
    //


    import { mapGetters , mapMutations , mapState} from "vuex";
    export default {
        name: 'doctorSettings',

        props: {
            idDoctor:{
                type: Number,
                default: 2,
            }
        },
        components: {
        },
        data: () => ({
            valid2: true,
            valid: true,
            searchInput:null,
            select: null,
            items: [
                'Item 1',
                'Item 2',
                'Item 3',
                'Item 4',
            ],
            checkbox: false,



        }),

        methods: {
            tags(t){
                //console.log(t);
                return this.$store.getters["doctorSettings/tagsSelected"](t);
            },
            setFilter(e, name){
                //console.log(e);
                this.$store.commit('doctorSettings/SET_FILTERS', {name:name, data:e});
            },
            getFilial(id){
                //console.log(id);
                let filials = this.$store.getters["doctorSettings/getFilials"];
                if(filials[id] && filials[id]['title']){
                    return filials[id]['title'];
                }else{
                    console.log('неправильная структура данных для филиала');
                    return '';
                }
            },
            getDoctor(id){
                //console.log(id);
                let doctors = this.$store.getters["doctorSettings/getDoctors"];
                if(doctors[id] && doctors[id]['surname']){
                    return doctors[id]['surname'];
                }else{
                    console.log('неправильная структура данных для доктора');
                    return '';
                }
            },

        },
        created(){
            console.log('created');
            this.$store.dispatch('doctorSettings/GET_INITIAL_SETTINGS');
            this.$store.dispatch('doctorSettings/GET_FILTERED_DOCTORS');
        },

        computed:{
            //====================================================================
            ...mapGetters({
                getDoctors:'doctorSettings/getDoctors'
                ,getFilials:'doctorSettings/getFilials'
                ,getArrLevels:'doctorSettings/getArrLevels'
                //,currentDoctorId:'doctorSettings/currentDoctorId'
                ,tagsSelected:'doctorSettings/tagsSelected'
                ,getArrGroupTags:'doctorSettings/getArrGroupTags'
                ,getFilialsDoctors:'doctorSettings/getFilialsDoctors'
            }),

            ...mapState({currentDoctorId:'doctorSettings/currentDoctorId'}),
            //====================================================================
            ...mapMutations({SET_CURRENT_DOCTOR_ID:'doctorSettings/SET_CURRENT_DOCTOR_ID'
                //,currentDoctorId:'doctorSettings/getDoctors'
            }),
            //====================================================================

            currentDoctorId:{
                get(){        //console.log(this);
                    //todo разобраться с mapGetters и mapState
                    //return this.currentDoctorId;
                    return this.$store.getters["doctorSettings/currentDoctorId"];
                },
                set(val){
                    //this.SET_CURRENT_DOCTOR_ID(val);
                    this.$store.commit('doctorSettings/SET_CURRENT_DOCTOR_ID', val);
                    this.$store.dispatch('doctorSettings/GET_DOCTOR_SETTINGS_AJAX');
                },
            },
            arrGroupTags : {
                get(){
                    console.log(this.getArrGroupTags);
                    return this.getArrGroupTags;
                },
            },
            filialsDoctors : {
                get(){
                    //console.log(this.getArrGroupTags);
                    return this.getFilialsDoctors;
                },
            },
            doctors : {
                get(){
                    return this.getDoctors;
                },
            },
            filials : {
                get(){
                    return this.getFilials;
                },
            },
        }


    }
</script>

<style scoped>

</style>
