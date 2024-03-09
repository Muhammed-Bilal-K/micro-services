export interface IOrders {
    id?:string,
    orderlist: Array<{
        productId: string;
        age:string
    }>;
    productId:string,
    userId: string,
    totalprice: Number,
}