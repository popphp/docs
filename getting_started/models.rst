Models
======

The Pop PHP Framework comes with a base abstract model class that can be extended to create
the model classes needed for your application. The abstract model class is a simple and
bare-bones data object that can be extended with whatever methods or properties you need
to work with your model. Data from the abstract model object is accessible via array access
and magic methods, and the model object is countable and iterable.

.. code-block:: php

    namespace MyApp\Model;

    use Pop\Model\AbstractModel;

    class MyModel extends AbstractModel
    {

        public function getById($id)
        {
            // Get a model object by ID
        }

        public function save($data)
        {
            // Save some data related to the model
        }

    }
