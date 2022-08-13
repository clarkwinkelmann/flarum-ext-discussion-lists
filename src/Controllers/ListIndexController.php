<?php

namespace ClarkWinkelmann\DiscussionLists\Controllers;

use ClarkWinkelmann\DiscussionLists\ListFilterer;
use ClarkWinkelmann\DiscussionLists\ListSearcher;
use ClarkWinkelmann\DiscussionLists\ListSerializer;
use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Flarum\Http\UrlGenerator;
use Flarum\Query\QueryCriteria;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListIndexController extends AbstractListController
{
    public $serializer = ListSerializer::class;

    public $include = [
        'discussions',
    ];

    public $sortFields = [
        'createdAt',
        'discussionCount',
        'name',
    ];

    public $sort = [
        'createdAt' => 'desc',
    ];

    protected $filterer;
    protected $searcher;
    protected $url;

    public function __construct(ListFilterer $filterer, ListSearcher $searcher, UrlGenerator $url)
    {
        $this->filterer = $filterer;
        $this->searcher = $searcher;
        $this->url = $url;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $filters = $this->extractFilter($request);
        $sort = $this->extractSort($request);

        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);

        $criteria = new QueryCriteria($actor, $filters, $sort);
        if (array_key_exists('q', $filters)) {
            $results = $this->searcher->search($criteria, $limit, $offset);
        } else {
            $results = $this->filterer->filter($criteria, $limit, $offset);
        }

        $document->addPaginationLinks(
            $this->url->to('api')->route('discussion-lists.index'),
            $request->getQueryParams(),
            $offset,
            $limit,
            $results->areMoreResults() ? null : 0
        );

        $this->loadRelations($results->getResults(), $this->extractInclude($request));

        return $results->getResults();
    }
}
