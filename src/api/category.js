import axios from 'axios'

export const fetchCategories = params =>{ return axios.get('/api/admin/categories',{params:params});};

export const fetchTypes = params =>{ return axios.get('/api/admin/categories/type',{params:params});};

export const fetchById = params =>{ return axios.get('/api/admin/categories/get',{params:params});};

export const saveCategory  = params => { return axios.post('/api/admin/categories', params);};

export const updateCategory = params => {return axios.put('/api/admin/categories',params);};

export const deleteCategory = params =>{return axios.delete('/category',{params:params});};

