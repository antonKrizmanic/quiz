export class QueryStringParameters {
    maxPageSize: number = 100;
    page: number = 1;
    searchTerm: string = "";
    type: string = "";
    field: string = "";
    ignorePageSize: boolean = true;
    perPage: number = 10;

    public constructor(init?: Partial<QueryStringParameters>) {
        Object.assign(this, init);
    }
}