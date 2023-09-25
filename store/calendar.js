
class LocalDate {
    constructor(year, month, day, hour,minute, second) {
        let systemDT = new Date()
        this.year = year ? year : systemDT.getFullYear();
        this.month = month ? month : (systemDT.getMonth() + 1);
        this.day = day ? day : systemDT.getDate();
        this.hour = hour ? hour : systemDT.getHours();
        this.minute = minute ? minute : systemDT.getMinutes();
        this.second = second ? second : systemDT.getSeconds();
    }
}

export const state =  () => ({
  currentDateTime: new LocalDate(),
  serverDateTime: new LocalDate(),
  timeIn: new LocalDate()
})

export const mutations = {
    SET_CURRENT_DATE_TIME(state, dateTime) {
        state.currentDateTime = dateTime;
    },
    SET_SERVER_DATE_TIME(state, dateTime) {
        state.serverDateTime = dateTime;
        state.timeIn = new LocalDate()
    }
}

export const actions = {
    initializedDateTime({commit, state}) {       
        let serverDateTime = new LocalDate(); //request from the server 
        commit('SET_SERVER_DATE_TIME', serverDateTime);   
        setInterval(
            ()=> {
                let s = state.serverDateTime;
                let L0 = state.timeIn;
                let L1 = new Date();
        
                let dy = L1.getFullYear() - L0.year;
                let dm = (L1.getMonth() + 1) - L0.month;
                let dd = L1.getDate() - L0.day;
                let dh = L1.getHours() - L0.hour;
                let dmi = L1.getMinutes() - L0.minute;
                let ds = L1.getSeconds() - L0.second;

                dy = dy < 0 ? dy * -1 : dy;
                dm = dm < 0 ? 12 - (dm * -1) : dm; 
                dd = dd < 0 ? (state.currentDateTime.day - 1 < 6 ? 31 - (dd * -1) : 30 - (dd * -1)) : dd;
                dh = dh < 0 ? 24 - (dh * -1) : dh;
                dmi = dmi < 0 ? 60 - (dmi * -1) : dmi;
                ds = ds < 0 ? 60 - (ds * -1) : ds;
                
                dh = dh == 23 ? s.hour * -1: dh;
                dmi = dmi == 59 ? s.minute * -1: dmi;
                ds = ds == 59 ? s.second * -1 : ds;
                
                let correctDateTime = new LocalDate(s.year + dy, s.month + dm, s.day + dd, s.hour + dh, s.minute + dmi, s.second + ds);
                commit('SET_CURRENT_DATE_TIME', correctDateTime);
             },
             300000);//5 minutes

    }
}
