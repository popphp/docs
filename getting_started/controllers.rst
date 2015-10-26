Controllers
===========

The Pop PHP Framework comes with a base abstract controller class that can be extended to create
the controller classes needed for your application. If you choose not to use the provided abstract
controller class, you can write your own, but it needs to implement the main controller interface
that is provided.

When building your controller classes by extending the abstract controller class, you can define
the methods that represent the actions that will be executed on the matched route. Here's an example
of what a basic controller might look like:

.. code-block:: php

    namespace MyApp\Controller;

    use Pop\Controller\AbstractController;
    use Pop\Http\Request;
    use Pop\Http\Response;

    class IndexController extends AbstractController
    {
        protected $request;
        protected $response;

        public function __construct(Request $request, Response $response)
        {
            $this->request  = $request;
            $this->response = $response;
        }

        public function index()
        {
            // Show the index page
        }

        public function products()
        {
            // Show the products page
        }

    }

The above example uses the ``popphp/pop-http`` component and injects a request and a response object
into the controller's constructor. For more on how to inject controller parameters into the controller's
constructor, refer the the section on controller parameters under Routing.
