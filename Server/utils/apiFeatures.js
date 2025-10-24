export class APIFeatures {
  constructor(query, queryString) {
    this.query = query; //Mongoose query Product.find()
    this.queryString = queryString; //query parameters from the URL
    this.page = parseInt(queryString.page) || 1;
    this.limit = parseInt(queryString.limit) || 8;
  }

  //Sorting by price, -price, latest
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split().join(" "); //convert params into moongose sort
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  //Pagination
  paginate() {
    const skip = (this.page - 1) * this.limit;
    this.query = this.query.skip(skip).limit(this.limit);
    return this;
  }

  //Get pagination metadata
  async getPaginationData(model) {
    const total = await model.countDocuments(this.query.getQuery()); //count maching items after filting
    const totalPages = Math.ceil(total / this.limit) || 1;

    return {
      page: this.page,
      limit: this.limit,
      total,
      totalPages,
    };
  }
}
