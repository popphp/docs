pop-acl
=======

The `popphp/pop-acl` component is an authorization and access control component the serves as a
hybrid between standard ACL and RBAC user access concepts. Beyond allowing or denying basic user
access, it provides support for roles, resources, inherited permissions and also assertions for
fine-grain access control.

It is not to be confused with the authentication component, as that deals with whether or not
a user is whom they claim they are (identity) and not about the resources to which they may or
may not have access.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-acl

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-acl": "^3.3.0",
        }
    }

Basic Use
---------

With an ACL object, you can create user roles, resources and set the permissions for which user
has access to which resource, and to what degree.

.. code-block:: php

    use Pop\Acl\Acl;
    use Pop\Acl\AclRole as Role;
    use Pop\Acl\AclResource as Resource;

    $acl = new Acl();

    $admin  = new Role('admin');
    $editor = new Role('editor');
    $reader = new Role('reader');

    $page = new Resource('page');

    $acl->addRoles([$admin, $editor, $reader]);
    $acl->addResource($page);

    $acl->allow('admin', 'page')           // Admin can do anything to a page
        ->allow('editor', 'page', 'edit')  // Editor can only edit a page
        ->allow('reader', 'page', 'read'); // Editor can only edit a page

    if ($acl->isAllowed('admin', 'page', 'add'))   { } // Returns true
    if ($acl->isAllowed('editor', 'page', 'edit')) { } // Returns true
    if ($acl->isAllowed('editor', 'page', 'add'))  { } // Returns false
    if ($acl->isAllowed('reader', 'page', 'edit')) { } // Returns false
    if ($acl->isAllowed('reader', 'page', 'read')) { } // Returns true

You can fine-tune the permissions as well, setting which user is denied or allowed.

.. code-block:: php

    $acl->allow('admin', 'page')         // Admin can do anything to a page
        ->allow('editor', 'page')        // Editor can do anything to a page
        ->deny('editor', 'page', 'add'); // except add a page

**Evaluate Multiple Roles**

You can also evaluate multiple roles at once by passing an array of roles to the following method:

.. code-block:: php

    if ($acl->isAllowedMany(['editor', 'reader'], 'page', 'edit'))  { } // Returns true
    if ($acl->isDeniedMany(['admin', 'editor'], 'page', 'edit'))   { } // Returns false

The purpose is that if you need to utilize an ACL-based system where users can hold multiple roles
at a time, you can then evaluate a user's permissions based on the user's set of assigned roles.
When passing the array of roles to the methods above, only one role has to satisfy the
logic to pass. If you need to be more strict about it, you can use:

.. code-block:: php

    if ($acl->isAllowedManyStrict(['editor', 'reader'], 'page', 'edit'))  { } // Returns false
    if ($acl->isDeniedManyStrict(['admin', 'editor'], 'page', 'edit'))   { } // Returns false

In the above examples, all roles passed must satisfy the logic to pass.

Role Inheritance
----------------

You can have roles inherit access rules as well.

.. code-block:: php

    use Pop\Acl\Acl;
    use Pop\Acl\AclRole as Role;
    use Pop\Acl\AclResource as Resource;

    $acl = new Acl();

    $editor = new Role('editor');
    $reader = new Role('reader');

    // Add the $reader role as a child role of $editor.
    // The role $reader will now inherit the access rules
    // of the role $editor, unless explicitly overridden.
    $editor->addChild($reader);

    $page = new Resource('page');

    $acl->addRoles([$editor, $reader]);
    $acl->addResource($page);

    // Neither the editor or reader can add a page
    $acl->deny('editor', 'page', 'add');

    // The editor can edit a page
    $acl->allow('editor', 'page', 'edit');

    // Both the editor or reader can read a page
    $acl->allow('editor', 'page', 'read');

    // Over-riding deny rule so that a reader cannot edit a page
    $acl->deny('reader', 'page', 'edit');

    if ($acl->isAllowed('editor', 'page', 'add'))  { } // Returns false
    if ($acl->isAllowed('reader', 'page', 'add'))  { } // Returns false
    if ($acl->isAllowed('editor', 'page', 'edit')) { } // Returns true
    if ($acl->isAllowed('reader', 'page', 'edit')) { } // Returns false
    if ($acl->isAllowed('editor', 'page', 'read')) { } // Returns true
    if ($acl->isAllowed('reader', 'page', 'read')) { } // Returns true

Assertions
----------

If you want even more of a fine-grain control over permissions and who is allowed to do what, you can use assertions.
First, define the assertion class, which implements the AssertionInterface. In this example, we want to check
that the user "owns" the resource via a matching user ID.

.. code-block:: php

    use Pop\Acl\Acl;
    use Pop\Acl\AclRole;
    use Pop\Acl\AclResource;
    use Pop\Acl\Assertion\AssertionInterface;

    class UserCanEditPage implements AssertionInterface
    {

        public function assert(
            Acl $acl, AclRole $role,
            AclResource $resource = null,
            $permission = null
        )
        {
            return ((null !== $resource) && ($role->id == $resource->user_id));
        }

    }

Then, within the application, you can use the assertions like this:

.. code-block:: php

    use Pop\Acl\Acl;
    use Pop\Acl\AclRole as Role;
    use Pop\Acl\AclResource as Resource;

    $acl = new Acl();

    $admin  = new Role('admin');
    $editor = new Role('editor');

    $page = new Resource('page');

    $admin->id     = 1001;
    $editor->id    = 1002;
    $page->user_id = 1001;

    $acl->addRoles([$admin, $editor]);
    $acl->addResource($page);

    $acl->allow('admin', 'page', 'add')
        ->allow('admin', 'page', 'edit', new UserCanEditPage())
        ->allow('editor', 'page', 'edit', new UserCanEditPage())

    // Returns true because the assertion passes,
    // the admin's ID matches the page's user ID
    if ($acl->isAllowed('admin', 'page', 'edit')) { }

    // Although editors can edit pages, this returns false
    // because the assertion fails, as this editor's ID
    // does not match the page's user ID
    if ($acl->isAllowed('editor', 'page', 'edit')) { }

Policies
--------

An alternate way to achieve even more specific fine-grain control is to use policies. Similar to assertions,
you have to write the policy class and it needs to use the ``Pop\Acl\Policy\PolicyTrait``. Unlike assertions that
are centered around the single ``assert()`` method, policies allow you to write separate methods that will be called
and evaluated via the ``can()`` method in the ``PolicyTrait``. Consider the following simple policy class:

.. code-block:: php

    use Pop\Acl\AclResource;

    class User
    {

        use Pop\Acl\Policy\PolicyTrait;

        public $id      = null;
        public $isAdmin = null;

        public function __construct($id, $isAdmin)
        {
            $this->id      = (int)$id;
            $this->isAdmin = (bool)$isAdmin;
        }

        public function create(User $user, AclResource $page)
        {
            return (($user->isAdmin) && ($page->getName() == 'page'));
        }

        public function update(User $user, AclResource $page)
        {
            return ($user->id === $page->user_id);
        }

        public function delete(User $user, AclResource $page)
        {
            return (($user->isAdmin) || ($user->id === $page->user_id));
        }

    }

The above policy class can enforce whether or not a user can create, update or delete a page resource.

.. code-block:: php

    $page   = new AclResource('page', ['id' => 2001, 'user_id' => 1002]);
    $admin  = new User(1001, true);
    $editor = new User(1002, false);

    // Returns true, because the user is an admin
    var_dump($admin->can('create', $page));

    // Returns false, because the user is an editor (not an admin)
    var_dump($editor->can('create', $page));

    // Returns false, because the admin doesn't "own" the page
    var_dump($admin->can('update', $page));

    // Returns true, because the editor does "own" the page
    var_dump($editor->can('update', $page));
