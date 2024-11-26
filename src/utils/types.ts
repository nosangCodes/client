export interface Business {
    "id": number,
    "name": string,
    "slug": string,
    "businessType": string,
    "userId": number,
    "createdAt": Date,
    "updatedAt": Date
}

export interface Menu {
    "id": number,
    "name": string,
    "slug": string,
    "businessId": number,
    "createdAt": Date,
    "updatedAt": Date
}

export interface Column {
    "id": number,
    "name": string,
    "menuId": number
}

export interface MenuItem {
    "itemId": number,
    "itemName": string,
    "itemDescription": string,
    "itemPrice": number,
    "columnId": number,
    "columnName": string,
    "menuId": number,
    "menuName": string
}

export interface CreateMenuItem {
    "name": string,
    "description": string,
    "price": number,
    "columnId": number
}

export interface CreateColumn {
    "name": string,
    "menuId": number
}