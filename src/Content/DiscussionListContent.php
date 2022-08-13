<?php

namespace ClarkWinkelmann\DiscussionLists\Content;

use ClarkWinkelmann\DiscussionLists\DiscussionList;
use Flarum\Api\Client;
use Flarum\Frontend\Document;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class DiscussionListContent
{
    protected $api;

    public function __construct(Client $api)
    {
        $this->api = $api;
    }

    public function __invoke(Document $document, ServerRequestInterface $request)
    {
        $queryParams = $request->getQueryParams();
        $id = Arr::pull($queryParams, 'list');

        // We only use the content class to generate a 404 page where needed
        // (because the SPA tries loading the list in a loop otherwise)
        // This doesn't provide pre-loading so no performance gains
        DiscussionList::query()->whereVisibleTo(RequestUtil::getActor($request))->findOrFail($id);
    }
}
