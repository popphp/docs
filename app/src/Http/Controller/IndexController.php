<?php

namespace Pop\Docs\Http\Controller;

use Pop\Docs\Model;

class IndexController extends AbstractController
{

    /**
     * Route action
     *
     * @return void
     */
    public function route(): void
    {
        $uri     = $this->request->getUriAsString();
        $version = '';
        if (preg_match('/^\/\d\.\d\/?/', $uri)) {
            $version = substr($uri, 0, 4);
            $uri     = substr($uri, 4);
        }

        $template = (($uri == '') || ($uri == '/')) ? '/index' : $uri;

        if (file_exists($this->viewPath . $version . $template . '.phtml')) {
            $this->prepareView($version . $template);
            $this->view->version = $version;
            $this->send();
        } else {
            $this->error();
        }
    }

    /**
     * Search action
     *
     * @return void
     */
    public function search(): void
    {
        $searchModel = new Model\Search();
        $query       = htmlentities(strip_tags($this->request->getQuery('query')), ENT_QUOTES, 'UTF-8');
        $version     = strip_tags($this->request->getQuery('version'));

        $this->prepareView('search');
        $this->view->query   = $query;
        $this->view->version = $version;
        $this->view->results = (!empty($query)) ? $searchModel->search($query, $version) : [];

        $this->send();
    }

    /**
     * Error action
     *
     * @return void
     */
    public function error(): void
    {
        $this->prepareView('error');
        $this->view->title = '404 : Page Not Found';
        $this->send(404);
    }

}