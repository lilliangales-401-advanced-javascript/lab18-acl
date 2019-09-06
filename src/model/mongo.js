'use strict';

class Model {

  constructor(schema) {
    this.schema = schema;
  }

  jsonSchema() {
    console.log(typeof this.schema.jsonSchema);
    return typeof this.schema.jsonSchema === 'function'
      ? this.schema.jsonSchema()
      : {};
  }

  /**
   *
   * @param _id
   * @returns {*}
   */
  get(_id) {
    console.log(this);
    let queryObject = _id ? { _id } : {};
    return this.schema.find(queryObject);
  }

  /**
   *
   * @param record
   * @returns {Promise|void|*}
   */
  create(record) {
    console.log('r',record);
    let newRecord = new this.schema(record);
    console.log('n', newRecord);
    return newRecord.save();
  }

  /**
   *
   * @param _id
   * @param record
   * @returns {Query}
   */
  update(_id, record) {
    return this.schema.findByIdAndUpdate(_id, record, { new: true });
  }

  /**
   *
   * @param _id
   * @returns {Query}
   */
  delete(_id) {
    return this.schema.findByIdAndDelete(_id);
  }

}

module.exports = Model;