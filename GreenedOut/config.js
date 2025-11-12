const DEV_CONFIG = {
    
    API_BASE_URL: 'http://localhost:8080/api',
    
  };
  
  const PROD_CONFIG = {
    API_BASE_URL: 'https://your-production-url.com/api',
  };
  
  const CONFIG = __DEV__ ? DEV_CONFIG : PROD_CONFIG;
  
  export const API_BASE_URL = CONFIG.API_BASE_URL;
  
  console.log('API Base URL:', API_BASE_URL);
  
  export default CONFIG;