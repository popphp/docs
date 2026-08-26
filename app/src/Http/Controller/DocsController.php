<?php

namespace Pop\Docs\Http\Controller;

class DocsController extends AbstractController
{

    /**
     * Render one documentation page.
     *
     * Every page has its own generated route, so reaching this action means the slug is real;
     * the lookup below cannot miss unless the route table and the page index have drifted
     * apart, which is a generator bug rather than a bad URL.
     *
     * @return void
     */
    public function page(): void
    {
        $slug = $this->slug();
        $page = $this->application->config['docs'][$slug] ?? null;

        if ($page === null) {
            $this->error(404);
            return;
        }

        $this->prepareView('docs.phtml');

        $this->view->title      = $page['title'];
        $this->view->description = $page['description'] ?? ($page['title'] . ' — Pop PHP Framework documentation.');
        $this->view->section    = $page['section'];
        $this->view->components = $page['components'];
        $this->view->slug       = $slug;
        $this->view->nav        = $this->nav($slug);
        $this->view->headings   = $page['headings'] ?? [];
        $this->view->prev       = $this->neighbour($page['prev']);
        $this->view->next       = $this->neighbour($page['next']);

        // The build step writes one view per page. Until it has run for this page, the shell
        // still renders and says so, rather than failing.
        $content = $this->viewPath . '/' . $page['view'];
        $this->view->content = is_file($content) ? $content : null;

        $this->send();
    }

    /**
     * The requested path, reduced to the canonical slug the page index is keyed by:
     * no query string, no base path, and no trailing slash except on the root.
     *
     * @return string
     */
    protected function slug(): string
    {
        $path = parse_url($this->request->getUriString(), PHP_URL_PATH) ?: '/';
        $base = $this->request->getBasePath();

        if (($base !== '') && str_starts_with($path, $base)) {
            $path = substr($path, strlen($base));
        }

        $path = rtrim($path, '/');

        return ($path === '') ? '/' : $path;
    }

    /**
     * The section tree, in sitemap order, with the current page marked.
     *
     * @param  string $current
     * @return array
     */
    protected function nav(string $current): array
    {
        $nav = [];

        foreach ($this->application->config['docs'] as $slug => $page) {
            $nav[$page['section']][] = [
                'slug'    => $slug,
                'title'   => $page['title'],
                'current' => ($slug === $current)
            ];
        }

        return $nav;
    }

    /**
     * Resolve a prev/next slug to what a link needs.
     *
     * @param  ?string $slug
     * @return ?array
     */
    protected function neighbour(?string $slug): ?array
    {
        if ($slug === null) {
            return null;
        }

        $page = $this->application->config['docs'][$slug] ?? null;

        return ($page === null) ? null : ['slug' => $slug, 'title' => $page['title']];
    }

}
