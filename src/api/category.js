import axios from 'axios'

export const fetchCategories = params =>{ return axios.get('/categories',{params:params});};

export const updateCategory = params => {return axios.post('/category',params);};

export const deleteCategory = params =>{return axios.delete('/category',{params:params});};

