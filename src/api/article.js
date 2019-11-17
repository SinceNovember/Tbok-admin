import axios from 'axios'

export const fetchArticles = params =>{ return axios.get('/articles',{params:params});};

export const fetchArticleGroup = () =>{ return axios.get('/articleGroup');};

export const updateArticle = params => {return axios.post('/article',params);};

export const deleteArticle = params =>{return axios.delete('/article',{params:params});};

