<?php

namespace ClarkWinkelmann\DiscussionLists\Controllers;

use ClarkWinkelmann\DiscussionLists\DiscussionList;
use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class ListDeleteController extends AbstractDeleteController
{
    protected function delete(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);

        /**
         * @var DiscussionList $list
         */
        $list = DiscussionList::query()->whereVisibleTo($actor)->findOrFail(Arr::get($request->getQueryParams(), 'id'));

        $actor->assertCan('edit', $list);

        $list->delete();
    }
}
