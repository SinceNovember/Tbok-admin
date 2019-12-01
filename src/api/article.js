import axios from 'axios'

export const fetchArticles = params =>{ return axios.get('/api/admin/articles',{params:params});};

export const fetchArticleGroup = () =>{ return axios.get('/api/admin/articles/articleGroup');};

export const updateArticle = params => {return axios.put('/api/admin/articles',params);};

export const updateArticle1 = params => {return axios.post('/api/admin/articles/type',params);};

export const deleteArticle = params =>{return axios.delete('/api/admin/articles',{params:params});};

