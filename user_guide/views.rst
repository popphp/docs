Views
=====

The ``popphp/pop-view`` component provides the functionality for creating and rendering views within
your application. Data can be passed into a view, filtered and pushed out to the UI of the application
to be rendering within the view template. As mentioned in the `MVC section`_ of the user guide, the
``popphp/pop-view`` component supports both file-based and stream-based templates.

Files
-----

With file-based view templates, the view object utilizes traditional PHP script files with the extension
``.php`` or ``.phtml``. The benefit of this type of template is that you can fully leverage PHP in manipulating
and displaying your data in your view.

Let's revisit and expand upon the basic example given in the previous `MVC section`_. First let's take a
look at the view template, ``index.phtml``:

.. code-block:: php

    <!DOCTYPE html>
    <html>

    <head>
        <title><?=$title; ?></title>
    </head>
    <body>
        <h1><?=$title; ?></h1>
    <?=$content; ?>
        <ul>
    <?php foreach ($links as $url => $link): ?>
            <li><a href="<?=$url; ?>"><?=$link; ?></a></li>
    <?php endforeach; ?>
        </ul>
    </body>

    </html>

Then, we can set up the view and its data like below. Notice in the script above, we've set it up to loop
through an array of links with the ``$links`` variable.

.. code-block:: php

    $data = [
        'title'   => 'View Example',
        'content' => '    <p>Some page content.</p>',
        'links'   => [
            'http://www.popphp.org/'          => 'Pop PHP Framework',
            'https://www.popphp.org/#popcorn' => 'Popcorn Micro Framework'
        ]
    ];

    $view = new Pop\View\View('index.phtml', $data);

    echo $view;

The result of the above example is:

.. code-block:: html

    <!DOCTYPE html>
    <html>

    <head>
        <title>View Example</title>
    </head>
    <body>
        <h1>View Example</h1>
        <p>Some page content.</p>
        <ul>
            <li><a href="http://www.popphp.org/">Pop PHP Framework</a></li>
            <li><a href="https://www.popphp.org/#popcorn">Popcorn Micro Framework</a></li>
        </ul>
    </body>

    </html>

As mentioned before, the benefit of using file-based templates is you can fully leverage PHP within the
script file. One common thing that can be utilized when using file-based templates is file includes.
This helps tidy up your template code and makes script files easier to manage by re-using template
code. Here's an example that would work for the above script:

**header.phtml**

.. code-block:: php

    <!DOCTYPE html>
    <html>

    <head>
        <title><?=$title; ?></title>
    </head>
    <body>

**footer.phtml**

.. code-block:: php

    </body>

    </html>


**index.phtml**

.. code-block:: php

    <?php include __DIR__ . '/header.phtml'; ?>
        <h1><?=$title; ?></h1>
    <?=$content; ?>
        <ul>
    <?php foreach ($links as $url => $link): ?>
            <li><a href="<?=$url; ?>"><?=$link; ?></a></li>
    <?php endforeach; ?>
        </ul>
    <?php include __DIR__ . '/footer.phtml'; ?>

Streams
-------

With stream-based view templates, the view object uses a string template to render the data within the view.
While using this method doesn't allow the use of PHP directly in the template like the file-based templates
do, it does support basic logic and iteration to manipulate your data for display. The benefit of this
is that it provides some security in locking down a template and not allowing PHP to be directly processed
within it. Additionally, the template strings can be easily stored and managed within the application and
remove the need to have to edit and transfer template files to and from the server. This is a common tactic
used by content management systems that have template functionality built into them.

Let's look at the same example from above, but with a stream template:

.. code-block:: php

    $tmpl = <<<TMPL
    <!DOCTYPE html>
    <html>

    <head>
        <title>[{title}]</title>
    </head>
    <body>
        <h1>[{title}]</h1>
    [{content}]
        <ul>
    [{links}]
            <li><a href="[{key}]">[{value}]</a></li>
    [{/links}]
        </ul>
    </body>

    </html>
    TMPL;

The above code snippet is a template stored as string. The stream-based templates use a system of **placeholders**
to mark where you want the value to go within the template string. This is common with most string-based templating
engines. In the case of ``popphp/pop-view``, the placeholder uses the square bracket/curly bracket combination
to wrap the variable name, such as ``[{title}]``. In the special case of arrays, where iteration is allowed,
the placeholders are marked the same way, but have an end mark like you see in the above template: ``[{links}]``
to ``[{/links}]``. The iteration you need can happen in between those placeholder marks.

Let's use the exact same examples from above, except passing the string template, ``$tmpl``, into the view
constructor:

.. code-block:: php

    $data = [
        'title'   => 'View Example',
        'content' => '    <p>Some page content.</p>',
        'links'   => [
            'http://www.popphp.org/'          => 'Pop PHP Framework',
            'https://www.popphp.org/#popcorn' => 'Popcorn Micro Framework'
        ]
    ];

    $view = new Pop\View\View($tmpl, $data);

    echo $view;

We can achieve exact same results as above:

.. code-block:: html

    <!DOCTYPE html>
    <html>

    <head>
        <title>View Example</title>
    </head>
    <body>
        <h1>View Example</h1>
        <p>Some page content.</p>
        <ul>
            <li><a href="http://www.popphp.org/">Pop PHP Framework</a></li>
            <li><a href="https://www.popphp.org/#popcorn">Popcorn Micro Framework</a></li>
        </ul>
    </body>

    </html>

As mentioned before, the benefit of using stream-based templates is you can limit the use of PHP within
the template for security, as well as store the template strings within the application for
easier access and management for the application users. And, streams can be stored in a number of ways.
The most common is as a string in the application's database that gets passed in to the view's constructor.
But, you can store them in a text-based file, such as ``index.html`` or ``template.txt``, and the view
constructor will detect that and grab the string contents from that template file. This will be applicable
when we cover **includes** and **inheritance**, as you will need to be able to reference other string-based
templates outside of the main one currently being used by the view object.

Stream Syntax
-------------

Scalars
~~~~~~~

Examples of using scalar values were shown above. You wrap the name of the variable in the placeholder
bracket notation, ``[{title}]``, in which the variable ``$title`` will render.

Arrays
~~~~~~

As mentioned in the example above, iterating over arrays use a similar bracket notation, but with a start
key ``[{links}]`` and an end key with a slash ``[{/links}]``. In between those markers, you can write a line
of code in the template to define what to display for each iteration:

.. code-block:: php

    $data = [
        'links'   => [
            'http://www.popphp.org/'          => 'Pop PHP Framework',
            'https://www.popphp.org/#popcorn' => 'Popcorn Micro Framework'
        ]
    ];

.. code-block:: text

    [{links}]
            <li><a href="[{key}]">[{value}]</a></li>
    [{/links}]

Additionally, when you are iterating over an array in a stream template, you have access to a counter in the
form of the placeholder, ``[{i}]``. That way, if you need to, you can mark each iteration uniquely:

.. code-block:: text

    [{links}]
            <li id="li-item-[{i}]"><a href="[{key}]">[{value}]</a></li>
    [{/links}]

The above template would render like this:

.. code-block:: html

            <li id="li-item-1"><a href="http://www.popphp.org/">Pop PHP Framework</a></li>
            <li id="li-item-2"><a href="https://www.popphp.org/#popcorn">Popcorn Micro Framework</a></li>

You can also access nested associated arrays and their values by key name, to give you an additional
level of control over your data, like so:

.. code-block:: php

    $data = [
        'links' => [
            [
                'title' => 'Pop PHP Framework',
                'url'   => 'http://www.popphp.org/'
            ],
            [
                'title' => 'Popcorn Micro Framework',
                'url'   => 'https://www.popphp.org/#popcorn'
            ]
        ]
    ];

.. code-block:: text

    [{links}]
            <li><a href="[{url}]">[{title}]</a></li>
    [{/links}]

The above template and data would render like this:

.. code-block:: html

            <li><a href="http://www.popphp.org/">Pop PHP Framework</a></li>
            <li><a href="https://www.popphp.org/#popcorn">Popcorn Micro Framework</a></li>

Conditionals
~~~~~~~~~~~~

Stream-based templates support basic conditional logic as well to test if a variable is set.
Here's an "if" statement:

.. code-block:: text

    [{if(foo)}]
        <p>The variable 'foo' is set to [{foo}].</p>
    [{/if}]

And here's an "if/else" statement:

.. code-block:: text

    [{if(foo)}]
        <p>The variable 'foo' is set to [{foo}].</p>
    [{else}]
        <p>The variable 'foo' is not set.</p>
    [{/if}]

You can also use conditionals to check if a value is set in an array:

.. code-block:: text

    [{if(foo[bar])}]
        <p>The value of '$foo[$bar]' is set to [{foo[bar]}].</p>
    [{/if}]

Furthermore, you can test if a value is set within a loop of an array, like this:

.. code-block:: php

    $data = [
        'links' => [
            [
                'title' => 'Pop PHP Framework',
                'url'   => 'http://www.popphp.org/'
            ],
            [
                'title' => 'Popcorn Micro Framework'
            ]
        ]
    ];

.. code-block:: text

    [{links}]
    [{if(url)}]
            <li><a href="[{url}]">[{title}]</a></li>
    [{/if}]
    [{/links}]

The above template and data would only render one item because the `url` key is not
set in the second value:

.. code-block:: html

            <li><a href="http://www.popphp.org/">Pop PHP Framework</a></li>

An "if/else" statement also works within an array loop as well:

.. code-block:: text

    [{links}]
    [{if(url)}]
            <li><a href="[{url}]">[{title}]</a></li>
    [{else}]
            <li>No URL was set</li>
    [{/if}]
    [{/links}]


.. code-block:: html

            <li><a href="http://www.popphp.org/">Pop PHP Framework</a></li>
            <li>No URL was set</li>

Includes
~~~~~~~~

As referenced earlier, you can store stream-based templates as files on disk. This is useful if you want
to utilize includes with them. Consider the following templates:

**header.html**

.. code-block:: html

    <!DOCTYPE html>
    <html>

    <head>
        <title>[{title}]</title>
    </head>
    <body>

**footer.html**

.. code-block:: html

    </body>

    </html>

You could then reference the above templates in the main template like below:

**index.html**

.. code-block:: html

    {{@include header.html}}
        <h1>[{title}]</h1>
    [{content}]
    {{@include footer.html}}

Note the include token uses a double curly bracket and @ symbol.

Inheritance
~~~~~~~~~~~

Inheritance, or blocks, are also supported with stream-based templates. Consider the following templates:

**parent.html**

.. code-block:: html

    <!DOCTYPE html>
    <html>

    <head>
    {{header}}
        <title>[{title}]</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    {{/header}}
    </head>

    <body>
        <h1>[{title}]</h1>
        [{content}]
    </body>

    </html>

**child.html**

.. code-block:: html

    {{@extends parent.html}}

    {{header}}
    {{parent}}
        <style>
            body { margin: 0; padding: 0; color: #bbb;}
        </style>
    {{/header}}

Render using the parent:

.. code-block:: php

    $view = new Pop\View\View('parent.html');
    $view->title   = 'Hello World!';
    $view->content = 'This is a test!';

    echo $view;

will produce the following HTML:

.. code-block:: html

    <!DOCTYPE html>
    <html>

    <head>

        <title>Hello World!</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    </head>

    <body>
        <h1>Hello World!</h1>
        This is a test!
    </body>

    </html>

Render using the child:

.. code-block:: php

    $view = new Pop\View\View('child.html');
    $view->title   = 'Hello World!';
    $view->content = 'This is a test!';

    echo $view;

will produce the following HTML:

.. code-block:: html

    <!DOCTYPE html>
    <html>

    <head>

        <title>Hello World!</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        <style>
            body { margin: 0; padding: 0; color: #bbb;}
        </style>

    </head>

    <body>
        <h1>Hello World!</h1>
        This is a test!
    </body>

    </html>

As you can see, using the child template that extends the parent, the ``{{header}}`` section
was extended, incorporating the additional **style** tags in the header of the HTML. Note that the
placeholder tokens for the extending a template use double curly brackets.

Filtering Data
--------------

You can apply filters to the data in the view as well for security and tidying up content. You pass
the ``addFilter()`` method a callable and any optional parameters and then call the ``filter()``
method to iterate through the data and apply the filters.

.. code-block:: php

    $view = new Pop\View\View('index.phtml', $data);
    $view->addFilter('strip_tags');
    $view->addFilter('htmlentities', [ENT_QUOTES, 'UTF-8'])
    $view->filter();

    echo $view;

You can also use the ``addFilters()`` to apply muliple filters at once:

.. code-block:: php

    $view = new Pop\View\View('index.phtml', $data);
    $view->addFilters([
        [
            'call'   => 'strip_tags'
        ],
        [
            'call'   => 'htmlentities',
            'params' => [ENT_QUOTES, 'UTF-8']
        ]
    ]);

    $view->filter();

    echo $view;

And if need be, you can clear the filters out of the view object as well:

.. code-block:: php

    $view->clearFilters();

.. _MVC section: ./mvc.html#views