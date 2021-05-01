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
                                   md="4">





                                <v-select
                                        class="pa-2"
                                        v-model="doctorSettings"
                                        :items="listChildAges"
                                        label="темперамент"
                                        :outlined="true"
                                ></v-select>

                            </v-col>
                            <v-col cols="12"
                                   sm="12"
                                   md="4">
                                <v-text-field
                                        class="pa-2"
                                        v-model="doctorSettings.doc__name"
                                        label="Имя"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12"
                                   sm="12"
                                   md="4">
                                <v-text-field
                                        class="pa-2"
                                        v-model="doctorSettings.doc__middlename"
                                        label="Отчество"
                                ></v-text-field>
                            </v-col>

                        </v-row>

                        <v-row no-gutters >
                            <v-col cols="12"
                                   sm="12"
                                   md="4">

                                <v-switch
                                        v-model="doctorSettings.doc__off"
                                        :label="'Доктор отключен'"
                                        :false-value="`0`"
                                        :true-value="`1`"
                                        :disabled="!doctorSettings.doc__off"
                                >

                                </v-switch>
                            </v-col>
                            <v-col cols="12"
                                   sm="12"
                                   md="4">
                                <v-switch
                                        v-model="doctorSettings.doc__holiday"
                                        :label="'Доктор в отпуске'"
                                        :false-value="`0`"
                                        :true-value="`1`"
                                        :disabled="!doctorSettings.doc__holiday"
                                >

                                </v-switch>
                            </v-col>
                            <v-col cols="12"
                                   sm="12"
                                   md="4">
                                <v-switch
                                        v-model="doctorSettings.doc__show_experience"
                                        :label="'Показывать опыт'"
                                        :false-value="`0`"
                                        :true-value="`1`"
                                        :disabled="!doctorSettings.doc__show_experience"

                                >

                                </v-switch>
                            </v-col>

                        </v-row>


                    </v-form>
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
            name: '',
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 10) || 'Имя не должно быть более 10 символов',
            ],
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
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
            validate () {
                this.$refs.form.validate()
            },
            reset () {
                this.$refs.form.reset()
            },
            SET_TAGS (e, name) {
                //console.log(e);
               //console.log(name);
                this.$store.commit('doctorSettings/SET_DOCTOR_TAGS', {name:name, data:e});
               // this.$refs.form.resetValidation()
            },
            onSaveDoctorData(){
                //console.log(this.$refs.form);//забываем jquery. Здесь не нужно брать данные формы. Они храняться в data
                this.$store.dispatch('doctorSettings/SAVE_DOCTOR_SETTINGS_AJAX');
            },
            tags(t){
                //console.log(t);
                return this.$store.getters["doctorSettings/tagsSelected"](t);
                //
                //return this.getChildAges();
                //return this.$store.getters["doctorSettings/tagsSelected"];
            },

        },
        created(){
            console.log('created');
            this.$store.dispatch('doctorSettings/GET_INITIAL_SETTINGS');

        },

        computed:{
            //====================================================================
            ...mapGetters({
                getDoctors:'doctorSettings/getDoctors'
                ,getArrLevels:'doctorSettings/getArrLevels'
                //,currentDoctorId:'doctorSettings/currentDoctorId'
                ,tagsSelected:'doctorSettings/tagsSelected'
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
            doctorSettings:{
                get(){        //console.log(this);
                    return this.$store.getters["doctorSettings/doctorSettings"];
                },
                set(val){

                    console.log(val);
                    //this.SET_CURRENT_DOCTOR_ID(val);
                    //this.$store.commit('doctorSettings/SET_CURRENT_DOCTOR_ID', val);
                    //this.$store.dispatch('doctorSettings/GET_DOCTOR_SETTINGS_AJAX');
                },
            },

            doctorSettings2:{
                get(){        //console.log(this);
                    return this.$store.getters["doctorSettings/doctorSettings"];
                },
                set(val){

                    console.log(val);
                    //this.SET_CURRENT_DOCTOR_ID(val);
                    //this.$store.commit('doctorSettings/SET_CURRENT_DOCTOR_ID', val);
                    //this.$store.dispatch('doctorSettings/GET_DOCTOR_SETTINGS_AJAX');
                },
            },
            listDoctors(){                return this.getDoctors;                },
            listChildAges(){                return this.getChildAges;                }

        }


    }
</script>

<style scoped>

</style>
