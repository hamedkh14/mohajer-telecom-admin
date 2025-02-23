export interface serviceDataApi {
    items: [
      {
          collectionId: string,
          collectionName: string,
          country: string,
          created: Date,
          description: string,
          id: string,
          isSpecial: boolean,
          operator: string,
          price: number,
          quantity: number,
          title:string,
          type: string,
          updated: Date
      }
    ],
    page: number,
    perPage: number,
    totalItems: number,
    totalPages: number
}
