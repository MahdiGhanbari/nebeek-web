import axios from 'axios'

// TODO: add local cache
class Db {
  constructor(baseUrl) {
    this.api = axios.create({
      baseURL: baseUrl
    })
    this.api.interceptors.response.use(function (response) {
      // TODO: handle 401 and reauthenticate
      return response;
    }, function (error) {
      // Do something with response error
      return Promise.reject(error);
    });
  }

  async login(user, password) {
    let response = await this.api.post('authenticate/', {'id': user, 'password': password});
    let token = response.data.token;
    this.api.defaults.headers.common['Authorization'] = 'JWT ' + token;
    return toten;
  }

  async find(id, filters={}, size=[0, 20], order=[]) {
    // TODO: use replace all .replace('.', '/')
    let url = id + '?'
    for (var k in filters) {
        url += `&filter[${k}]=${filters[k]}`
    }
    url += `&page[offset]=${size[0]}&pages[size]=${size[1]}`
    if (order) {
      url += '&sort=' + order.join(',')
    }
    try {
      let response = await this.api.get(url)
      return response.data.data
    } catch(err) {
    }
  }

  async save(self, obj) {
    try {
      let response = await this.api.post('/', obj)
      return response.data
    } catch(err) {

    }
  }

  async update(self, changes) {
    try {
      let response = await this.api.patch(obj.id, changes)
      return response.data
    } catch(err) {

    }
  }
}

export default new Db(process.env.apiBaseUrl)
