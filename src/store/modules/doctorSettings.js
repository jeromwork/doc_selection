import axios from 'axios'


export default {
  namespaced:true,
  mutations: {
    SET_CURRENT_DOCTOR_ID(state, val) {

      state.currentDoctorId = val;
      //this.GET_DOCTOR_SETTINGS_AJAX();
      //console.log(state);
    },
    FILL_DOCTOR_SETTINGS_DATA(state, doctor) {

      state.doctorSettings = doctor.data[0];
      console.log(state);
      },
    SET_DOCTOR_TAGS(state, tags ={}) {

      state.doctorSettings['bind'][tags.name] = tags.data ;
      console.log(state);

      },
    SET_LIST_DOCTORS(state, doctors) {

      if(!Array.isArray(doctors)){console.log('необходимо передать массив');}

      state.doctors = doctors;
//здесь преобразуем присланный массив в формате сервера в формат нужный для select
//       state.doctors= doctors.map(function (doc) {
//        // console.log(doc);
//         return {value:doc.doc__id, text:doc.doc__fullname};
//       });


    },
  },
  actions:{

    async GET_DOCTORS_AJAX({state}){

      let qdata = {
        action:  'doctors/get',
        cors_key : '8cbd6a0c2e767862b02887a446bb34ca',
        include_fields : {doc__id:'value', doc__fullname:'text'},
        length : 1000,
      };
      // console.log(qdata);
      // console.log(state);
      axios
          .post(state.iservices_connector_url, qdata)
          .then(response => {this.info = response

            console.log(response.data);
            this.commit('doctorSettings/SET_LIST_DOCTORS', response.data.data);
            //
          }).catch(error => console.log(error+'error'));
    },
    async GET_DOCTOR_SETTINGS_AJAX({getters, state}){
      const formData = new FormData();
      formData.append("action", 'doctors/get');
      formData.append("cors_key", '8cbd6a0c2e767862b02887a446bb34ca');
     // formData.append("fields", 'id, fullname');
      formData.append("id", getters.currentDoctorId);


      axios

          .post(state.iservices_connector_url, formData)
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

          .post(state.iservices_connector_url, qdata)
          .then(response => {this.info = response

            //this.commit('doctorSettings/FILL_DOCTOR_SETTINGS_DATA', response.data);
          });
    },




    async getDoctorsAjax2(){
      const res = await fetch('https://gorest.co.in/public-api/users');
      //console.log(res);
      const initialData = await res.json();


      this.commit('doctorSettings/initialData', initialData);


      //this.commit('Shops/initialData', initialData);
//ctx.commit('setPF', JSON.parse(prods));
    }
  },
  state: {
    iservices_connector_url:(window.location.host === 'http://localhost:8080/')? '/assets/components/eastclinic/iservices/connector.php': 'http://dev.eastclinic.local/assets/components/eastclinic/iservices/connector.php',
    doctorSettings: {},
    doctors:[
      {id:0, name:'Выберите доктора'}
    ],
    currentDoctorId:1,
    arrDocLevels:[
      {value:'0', text:'неподходит'},
      {value:'1', text:'средне'},
      {value:'2', text:'подходит'},

    ],
     },
  getters: {
    getDoctors: state => {        return state.doctors;      },
    getArrLevels: state => {        return state.arrDocLevels;      },
    //todo разобраться почему currentDoctorId is not a function
    currentDoctorId: state => {        return state.currentDoctorId;      },
    doctorSettings: state => {        return state.doctorSettings ;      },
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
