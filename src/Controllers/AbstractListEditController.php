<?php

namespace ClarkWinkelmann\DiscussionLists\Controllers;

use ClarkWinkelmann\DiscussionLists\DiscussionList;
use ClarkWinkelmann\DiscussionLists\ListSerializer;
use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Flarum\User\User;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

abstract class AbstractListEditController extends AbstractShowController
{
    public $serializer = ListSerializer::class;

    public $include = [
        'discussions',
    ];

    protected function data(ServerRequestInterface $request, Document $document): DiscussionList
    {
        $actor = RequestUtil::getActor($request);

        /**
         * @var DiscussionList $list
         */
        $list = DiscussionList::query()->whereVisibleTo($actor)->findOrFail(Arr::get($request->getQueryParams(), 'id'));

        $actor->assertCan('edit', $list);

        $attributes = Arr::get($request->getParsedBody(), 'data.attributes');

        $this->edit($request, $actor, $list, is_array($attributes) ? $attributes : []);

        return $list;
    }

    abstract protected function edit(ServerRequestInterface $request, User $actor, DiscussionList $list, array $attributes);
}
