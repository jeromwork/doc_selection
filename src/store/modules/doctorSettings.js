import axios from 'axios'
import { DOC_SELECTION_CONNENTOR_URL } from '/src/api/api_config.js';

export default {
  namespaced:true,
  mutations: {
    SET_TAGS(state, tags) {
      state.arrGroupTags = tags;
      //
      },
    SET_DOCTORS(state, items) {
      items.forEach(function(item) {
        state.doctors[item.id*1] = item;
      });
      //
    },
    SET_FILIALS(state, items) {
      items.forEach(function(item) {
        state.filials[item.id*1] = item;
      });
      //console.log(state.filials);
    },
    SET_FILIALS_DOCTORS(state, data) {
      state.filialsDoctors = data;
      //console.log(state);
    },

    SET_LIST_DOCTORS(state, doctors) {

      if(!Array.isArray(doctors)){console.log('необходимо передать массив');}

      state.doctors = doctors;
    },
    SET_FILTERS(state, tags =[]){
      if(!tags.data || (Array.isArray(tags.data) && tags.data.length === 0)){
        delete state.arrFilter[tags.name];
      }else{
        state.arrFilter[tags.name] = tags.data ;
      }
      this.dispatch('doctorSettings/GET_FILTERED_DOCTORS', state);
    },
  },
  actions:{
    async GET_INITIAL_SETTINGS(){
      let qdata = {
        action:  'get_service_data',
        cors_key : '8cbd6a0c2e767862b02887a446bb34ca',
        getDataType:{group_tags : 1, filials : 1, doctors : 1},
      };
      axios
          .post(DOC_SELECTION_CONNENTOR_URL, qdata)
          .then(response => {this.info = response
            console.log(response.data);
            if(response.data.group_tags){
              this.commit('doctorSettings/SET_TAGS', response.data.group_tags);
            }
            if(response.data.filials){
              this.commit('doctorSettings/SET_FILIALS', response.data.filials);
            }
            if(response.data.doctors){
              this.commit('doctorSettings/SET_DOCTORS', response.data.doctors);
            }

          }).catch(error => console.log(error+'error'));
    },
    async GET_FILTERED_DOCTORS({getters}){
      let qdata = {
        action:  'doctors/get',
        cors_key : '8cbd6a0c2e767862b02887a446bb34ca',
        filterTags:getters.getFilter,
        };

      //console.log(getters.getFilter);
      axios
          .post(DOC_SELECTION_CONNENTOR_URL, qdata)
          .then(response => {this.info = response
            //console.log(response.data.data);
            this.commit('doctorSettings/SET_FILIALS_DOCTORS', response.data.data);
          }).catch(error => console.log(error+'error'));
    },
    async GET_DOCTOR_SETTINGS_AJAX({getters}){
      const formData = new FormData();
      formData.append("action", 'doctors/get');
      formData.append("cors_key", '8cbd6a0c2e767862b02887a446bb34ca');
     // formData.append("fields", 'id, fullname');
      formData.append("id", getters.currentDoctorId);


      axios

          .post(DOC_SELECTION_CONNENTOR_URL, formData)
          .then(response => {this.info = response

            //console.log(response);
            this.commit('doctorSettings/FILL_DOCTOR_SETTINGS_DATA', response.data);
          });
    },
    async SAVE_DOCTOR_SETTINGS_AJAX({getters, state}){
      console.log(state.doctorSettings);
      let qdata = {
        ...state.doctorSettings,
        action:'doctors/set',
        cors_key:'8cbd6a0c2e767862b02887a446bb34ca',
        id:getters.currentDoctorId};
      axios

          .post(state.doc_selection_connector_url, qdata)
          .then(response => {this.info = response

            //this.commit('doctorSettings/FILL_DOCTOR_SETTINGS_DATA', response.data);
          });
    },

  },
  state: {
    doctorSettings: {},
    doctors: {},
    filials:{1:{id:1, title:'филиал1'}},
    filialsDoctors: {},
    currentDoctorId:1,
    arrDocLevels:[
      {value:'0', text:'неподходит'},
      {value:'1', text:'средне'},
      {value:'2', text:'подходит'},

    ],
    arrFilter:{},
    arrGroupTags:{},
     },
  getters: {
    getDoctors: state => {        return state.doctors;      },
    getFilials: state => {        return state.filials;      },
    getArrLevels: state => {        return state.arrDocLevels;      },
    getFilter: state => {        return state.arrFilter;      },
    //todo разобраться почему currentDoctorId is not a function
    currentDoctorId: state => {        return state.currentDoctorId;      },
    doctorSettings: state => {        return state.doctorSettings ;      },
    getArrGroupTags: state => {        return state.arrGroupTags ;      },
    getFilialsDoctors: state => {        return state.filialsDoctors ;      },
    tagsSelected: state => type =>  {
     console.log(type);

      if(state.doctorSettings['bind'] && state.doctorSettings['bind'][type]){
       // console.log('Обновляем tagsSelected');
        return state.doctorSettings['bind'][type] ;
      }else{
        return[];
      }
          },
  },








}
