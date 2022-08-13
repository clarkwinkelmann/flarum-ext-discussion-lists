<?php

namespace ClarkWinkelmann\DiscussionLists\Controllers;

use ClarkWinkelmann\DiscussionLists\DiscussionList;
use ClarkWinkelmann\DiscussionLists\ListSerializer;
use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListShowController extends AbstractShowController
{
    public $serializer = ListSerializer::class;

    public $include = [
        'user',
        'discussions',
    ];

    protected function data(ServerRequestInterface $request, Document $document): DiscussionList
    {
        $actor = RequestUtil::getActor($request);

        return DiscussionList::query()->whereVisibleTo($actor)->findOrFail(Arr::get($request->getQueryParams(), 'id'));
    }
}
