export const Routes ={

    Base_url: 'https://fakestoreapi.com',

    //=====================
    // Product Routes
    //======================

    GET_ALL_PRODUCTS: '/products',
    GET_PRODUCT_BY_ID: '/products/:{id}',
    GET_PRODUCTS_IN_CATEGORY: '/products/category/:category',
    GET_ALL_CATEGORIES: '/products/categories',
    GET_PRODUCTS_WITH_LIMIT: '/products?limit=:limit',
    GET_PRODUCTS_SORTED: '/products?sort={ORDER}',
    CREATE_PRODUCT: '/products',
    UPDATE_PRODUCT: '/products/:{id}',
    DELETE_PRODUCT: '/products/:{id}',

    //=====================
    // USER  Routes
    //======================
    GET_ALL_USERS: '/users',
    GET_USER_BY_ID: '/users/:{id}',
    GET_USERS_IN_LIMIT: '/users?limit=:limit',
    GET_USERS_SORTED: '/users?sort={ORDER}',
    CREATE_USER: '/users',
    UPDATE_USER: '/users/:{id}',
    DELETE_USER: '/users/:{id}',

    //=====================
    // CART  Routes
    //======================    

    GET_ALL_CARTS: '/carts',
    GET_CART_BY_ID: '/carts/:{id}',
    GET_USER_CART: '/carts/user/:{userId}',
    GET_CARTS_IN_LIMIT: '/carts?limit=:limit',  
    GET_CARTS_SORTED: '/carts?sort={ORDER}',
    GET_CARTS_BY_DATE_RANGE: '/carts?startdate={START_DATE}&enddate={END_DATE}',
    CREATE_CART: '/carts',
    UPDATE_CART: '/carts/:{id}',
    DELETE_CART: '/carts/:{id}',

    //=====================
    // AUTHENTICATION  Routes
    //======================    

    AUTH_LOGIN: '/auth/login',


}