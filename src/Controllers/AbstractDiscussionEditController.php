<?php

namespace ClarkWinkelmann\DiscussionLists\Controllers;

use ClarkWinkelmann\DiscussionLists\DiscussionList;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\DiscussionRepository;
use Flarum\User\User;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

abstract class AbstractDiscussionEditController extends AbstractListEditController
{
    protected $discussions;

    public function __construct(DiscussionRepository $discussions)
    {
        $this->discussions = $discussions;
    }

    protected function edit(ServerRequestInterface $request, User $actor, DiscussionList $list, array $attributes)
    {
        $discussion = $this->discussions->findOrFail(Arr::get($request->getQueryParams(), 'discussionId'), $actor);

        $this->editDiscussion($list, $discussion, $attributes);
    }

    abstract protected function editDiscussion(DiscussionList $list, Discussion $discussion, array $attributes);
}
