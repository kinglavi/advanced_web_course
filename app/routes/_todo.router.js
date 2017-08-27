// ```
// _todo.js
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// _todo.js may be freely distributed under the MIT license
// ```

// */app/routes/_todo.router.js*

// ## Ad API object

// HTTP Verb  Route                 Description

// GET        /api/ad             Get all of the ad items
// GET        /api/ad/:ad_id    Get a single ad item by ad item id
// POST       /api/ad             Create a single ad item
// DELETE     /api/ad/:ad_id    Delete a single ad item
// PUT        /api/ad/:ad_id    Update a ad item with new info

// Load the todo model
import Todo from '../models/todo.model';

export default (app, router) => {

  // ### Ad API Routes

  // Define routes for the todo item API

  router.route('/ad')

    // ### Create a todo item

    // Accessed at POST http://localhost:8080/api/ad

    // Create a todo item
    .post((req, res) => {

      Todo.create({

        text : req.body.text,
        name : req.body.name

      }, (err, todo) => {

        if (err)
          res.send(err);

        // DEBUG
        console.log(`Todo created: ${todo}`);

        Todo.find((err, todos) => {
          if(err)
            res.send(err);

          res.json(todos);
        });
      });
    })

    // ### Get all of the todo items

    // Accessed at GET http://localhost:8080/api/ad
    .get((req, res) => {

      // Use mongoose to get all todo items in the database
      Todo.find((err, todo) => {

        if(err)
          res.send(err);

        else
          res.json(todo);
      });
    });

  router.route('/ad/:ad_id')

    // ### Get a todo item by ID

    // Accessed at GET http://localhost:8080/api/ad/:todo_id
    .get((req, res) => {

      // Use mongoose to a single todo item by id in the database
      Todo.findOne(req.params.todo_id, (err, todo) => {

        if(err)
          res.send(err);

        else
          res.json(todo);
      });
    })

    // ### Update a todo item by ID

    // Accessed at PUT http://localhost:8080/api/ad/:todo_id
    .put((req, res) => {

      // use our todo model to find the todo item we want
      Todo.findOne({

        '_id' : req.params.todo_id

      }, (err, todo) => {

        if (err)
          res.send(err);

        // Only update a field if a new value has been passed in
        if (req.body.text)
          todo.text = req.body.text;
        if (req.body.name)
          todo.name = req.body.name;

        // save the todo item
        return todo.save((err) => {

          if (err)
            res.send(err);

          return res.send(todo);

        });
      });
    })

    // ### Delete a todo item by ID

    // Accessed at DELETE http://localhost:8080/api/ad/:todo_id
    .delete((req, res) => {

      // DEBUG
      console.log(`Attempting to delete todo with id: ${req.params.ad_id}`);

      Todo.remove({

        _id : req.params.ad_id
      }, (err, todo) => {

        if(err)
          res.send(err);

        console.log('Ad successfully deleted!');

        Todo.find((err, todos) => {
          if(err)
            res.send(err);

          res.json(todos);
        });
      });
    });
};
