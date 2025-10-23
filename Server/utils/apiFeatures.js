export class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //Sorting by price, -price, latest
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split().join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  //Pagination
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    //page=3&limit=10 1-10 for page 1, 11-20 for page 2, 21-30 page 3
    this.query = this.query.skip(skip).limit(limit);

    this.page = page; //save page
    this.limit = limit; //save limit
    return this;
  }

  //Get pagination metadata
  async getPaginationData(model) {
    const total = await model.countDocuments(this.query.getQuery()); //filtered count
    const totalPages = Math.ceil(total / this.limit) || 1;

    return {
      page: this.page,
      limit: this.limit,
      total,
      totalPages,
    };
  }
}
