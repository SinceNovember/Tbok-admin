import axios from 'axios'

export const fetchMenus= () =>{return axios.get('/menus');};