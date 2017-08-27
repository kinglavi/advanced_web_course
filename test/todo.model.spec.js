'use strict';

// import the `mongoose` helper utilities
let utils = require('./utils');
import chai from 'chai';
let should = chai.should();

// import our `Ad` mongoose model
import Todo from '../app/models/todo.model';

describe('Ad: models', () => {

  describe('create()', () => {

    it('should create a new Ad', (done) => {

      // Create a `Ad` object to pass to `Ad.create()``
      let t = {

        text: 'Write better tests... <.<'
      };

      Todo.create(t, (err, createdTodo) => {

        // Confirm that that an error does not exist
        should.not.exist(err);

        // verify that the returned `todo` is what we expect
        createdTodo.text.should.equal('Write better tests... <.<');

        // Call done to tell mocha that we are done with this test
        done();
      });
    });
  });
});
